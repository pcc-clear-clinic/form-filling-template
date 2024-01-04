from flask import make_response, request, jsonify, Blueprint
import logging
import requests
from bs4 import BeautifulSoup
from formfillservice.endpoints.oeci_login import attempt_login

from formfillservice.crypto import DataCipher

logger = logging.getLogger("logger")
cipher = DataCipher(key="SECRET_KEY")


def get_case_page(session, case_number):
    to_search_payload = {
        "NodeID": "101100,102100,103100,104100,104210,104215,104220,104225,104310,104320,104330,104410,104420,104430,104440,105100,106100,106200,106210,107100,107200,107300,107400,107500,108100,109100,110100,110200,111100,112100,113100,114100,115100,115200,116100,117100,118100,119100,120100,121100,122100,122200,123100,124100,124200,125100,126100,127100,150000,150100,150200",
        "NodeDesc": "All+Locations",
    }
    to_search_response = session.post(
        "https://publicaccess.courts.oregon.gov/PublicAccessLogin/Search.aspx?ID=200",
        data=to_search_payload,
    )
    logger.info(f"case_number from request:{case_number}" )

    soup = BeautifulSoup(to_search_response.text, "html.parser")

    viewstate = soup.find("input", {"name": "__VIEWSTATE"}).get("value")
    viewstategenerator = soup.find("input", {"name": "__VIEWSTATEGENERATOR"}).get(
        "value"
    )
    eventvalidation = soup.find("input", {"name": "__EVENTVALIDATION"}).get("value")
    nodeid = soup.find("input", {"name": "NodeID"}).get("value")
    nodedesc = soup.find("input", {"name": "NodeDesc"}).get("value")

    search_payload = {
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__VIEWSTATE": viewstate,
        "__VIEWSTATEGENERATOR": viewstategenerator,
        "__EVENTVALIDATION": eventvalidation,
        "NodeID": nodeid,
        "NodeDesc": nodedesc,
        "SearchBy": "0",
        "ExactName": "on",
        "CaseSearchMode": "CaseNumber",
        "CaseSearchValue": case_number,
        "CitationSearchValue": "",
        "CourtCaseSearchValue": "",
        "PartySearchMode": "Name",
        "AttorneySearchMode": "Name",
        "LastName": "",
        "FirstName": "",
        "cboState": "AA",
        "MiddleName": "",
        "DateOfBirth": "",
        "DriverLicNum": "",
        "CaseStatusType": "0",
        "DateFiledOnAfter": "",
        "DateFiledOnBefore": "",
        "chkCriminal": "on",
        "chkFamily": "on",
        "chkCivil": "on",
        "chkProbate": "on",
        "chkDtRangeCriminal": "on",
        "chkDtRangeFamily": "on",
        "chkDtRangeCivil": "on",
        "chkDtRangeProbate": "on",
        "chkCriminalMagist": "on",
        "chkFamilyMagist": "on",
        "chkCivilMagist": "on",
        "chkProbateMagist": "on",
        "DateSettingOnAfter": "",
        "DateSettingOnBefore": "",
        "SortBy": "fileddate",
        "SearchSubmit": "Search",
        "SearchType": "CASE",
        "SearchMode": "CASENUMBER",
        "NameTypeKy": "",
        "BaseConnKy": "",
        "StatusType": "true",
        "ShowInactive": "",
        "AllStatusTypes": "true",
        "CaseCategories": "",
        "RequireFirstName": "",
        "CaseTypeIDs": "",
        "HearingTypeIDs": "",
        "SearchParams": f"SearchBy~~Search+By:~~Case~~Case||chkExactName~~Exact+Name:~~on~~on||CaseNumberOption~~Case+Search+Mode:~~CaseNumber~~Number||CaseSearchValue~~Case+Number:~~{case_number}~~{case_number}||AllOption~~All~~0~~All||selectSortBy~~Sort+By:~~Filed+Date~~Filed+Date",
    }
    search_response = session.post(
        "https://publicaccess.courts.oregon.gov/PublicAccessLogin/Search.aspx?ID=200",
        data=search_payload,
    )

    soup = BeautifulSoup(search_response.text, "html.parser")
    case_links = [
        link
        for link in soup.find_all("a")
        if link.get("href") and "CaseDetail" in link["href"]
    ]
    if len(case_links) == 0:
        raise NoCasesFoundException
    case_link = case_links[0]["href"]
    logger.info(case_link)

    case_page_response = session.get(
        f"https://publicaccess.courts.oregon.gov/PublicAccessLogin/{case_link}"
    )
    return case_page_response.text


bp = Blueprint("api/oeci_scrape", __name__, url_prefix="/api/oeci_scrape")


def get_credentials_from_request():
    if "oeci" in request.cookies.keys():
        logger.info("found creds in cookie")
        decrypted_credentials = cipher.decrypt(request.cookies["oeci"])
        username = decrypted_credentials["username"]
        password = decrypted_credentials["password"]
    else:
        raise MissingCredentialsException
    return {"username": username, "password": password}


def get_plaintiff_information_by_case_number(session, case_number):
    case_page = get_case_page(session, case_number)
    soup = BeautifulSoup(case_page, "html.parser")
    plaintiffs = [plaintiff.strip() for plaintiff in soup.find("b").text.split("vs")[0].strip().split(",")]

    addresses = []
    party_table = [
        table for table in soup.find_all("table") if "Party Information" in table.text
    ][0]
    rows = party_table.find_all("tr")
    for i in range(len(rows)):
        if rows[i].find("th") and "Plaintiff" in rows[i].find("th").text:
            addresses.append(
                [
                    line.strip()
                    for line in rows[i + 1]
                    .find("td")
                    .get_text(separator="\n")
                    .strip()
                    .split("\n")
                ]
            )
    return plaintiffs, addresses


@bp.route("/", methods=["POST"])
def scrape():
    data = request.get_json()

    try:
        credentials = get_credentials_from_request()
    except MissingCredentialsException:
        return jsonify({"message": "Must log in to OECI"}), 401
    username = credentials["username"]
    password = credentials["password"]

    case_number = data.get("case_number")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    session = requests.Session()
    login_result = attempt_login(session, username, password)
    if not login_result:
        return jsonify({"message": "Login to oeci failed"}), 401

    try:
        plaintiffs, addresses = get_plaintiff_information_by_case_number(
            session, case_number
        )

    except NoCasesFoundException:
        return jsonify({"message": "No cases found"}), 404
    except Exception as ex2:
        return jsonify({"message": f"{ex2}"}), 400

    response = make_response(
        jsonify({"plaintiffs": plaintiffs, "addresses": addresses}),
        201,
        {
            "Access-Control-Allow-Credentials": True,
        },
    )

    return response


class MissingCredentialsException(Exception):
    pass


class NoCasesFoundException(Exception):
    pass
