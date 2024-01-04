import os
from flask import make_response, request, jsonify, Blueprint
import logging
import requests

from formfillservice.crypto import DataCipher

logger = logging.getLogger("logger")
cipher = DataCipher(key="SECRET_KEY")


def attempt_login(session, username, password):
    url = "https://publicaccess.courts.oregon.gov/PublicAccessLogin/login.aspx"
    payload = {
        "UserName": username,
        "Password": password,
        "ValidateUser": "1",
        "dbKeyAuth": "JusticePA",
        "SignOn": "Sign+On",
    }

    login_response = session.post(url, data=payload)

    return "Case Records" in login_response.text


bp = Blueprint("api/oeci_login", __name__, url_prefix="/api/oeci_login")


@bp.route("/", methods=["POST"])
def make_oeci_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    credentials = {"username": username, "password": password}

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    session = requests.Session()
    login_result = attempt_login(session, username, password)
    if not login_result:
        return jsonify({"message": "Login to oeci failed"}), 404

    encrypted_credentials = cipher.encrypt(credentials)

    response = make_response(
        jsonify({}),
        201,
        {
            "Access-Control-Allow-Credentials": True,
        },
    )

    response.set_cookie(
        "oeci",
        secure=os.getenv("TIER") == "production",
        httponly=False,
        samesite="strict",
        value=encrypted_credentials,
        max_age=60 * 60 * 24 * 365 * 2000,
    )
    return response
