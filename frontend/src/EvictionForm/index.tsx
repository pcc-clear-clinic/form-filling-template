import React, { useState } from "react";
import { fillAndDownloadEvictionExpungement } from "./fillAndDownload";
import validate, { INITIAL_INVALID_STATE } from "./validate";
import { COUNTIES } from "../components/constants";
import FillableFieldsSet from "../components/FillableFieldsSet";
import { Button, Checkbox } from "@mui/material";
import { Field } from "../components/inputHandlersAndTypes";

export type EvictionFormField = Field & {
  evictionPdfFields?: string[];
};

export const EVICTION_FIELDS_IN_SECTIONS: [
  React.ReactNode,
  EvictionFormField[],
][] = 
[
  [
    "Case Information",
    [
      {
      id: "casenumber",
      label: "Case Number",
      required: true,
      evictionPdfFields: ["Case No"],
    },
      {
        id: "county",
        label: "Filing County",
        selectionList: COUNTIES,
        required: true,
        evictionPdfFields: ["IN THE CIRCUIT COURT OF THE STATE OF OREGON"],
      },
      {
        id: "plaintiff",
        label: "Plaintiff",
        required: true,
        evictionPdfFields: ["1", "Text2"],
      },
      {
        id: "plaintiffAddress",
        label: "Plaintiff Address",
        required: true,
        evictionPdfFields: ["Text3"],
      },
      {
        id: "defendant",
        label: "Defendant", 
        required: true,
        evictionPdfFields: ["v 1"],
      },
      {
        id: "fullname",
        label: "Name (First Middle Last)",
        required: true,
        evictionPdfFields: ["Name printed"],
      },
      {
        id: "address",
        label: "Address",
        required: true,
        evictionPdfFields: ["Address"],
      },
      {
        id: "cityState",
        label: "City, State Zipcode",
        required: true,
        evictionPdfFields: ["City State ZIP"],
      },
      {
        id: "phone",
        label: "Phone Number",
        required: true,
        evictionPdfFields: ["Phone"],
      },
    ],
  ],
  [
    "Eligibility", 
  [
    {
      id: "dismissed",
      label: "Dismissed in Tenant's Favor",
      checkbox: true,
      evictionPdfFields: ["dismissal in my favor I was not ordered to leave the property"],
    },
    {
      id: "restitution",
      label: "Tenant Evicted",
      checkbox: true,
      evictionPdfFields: [
        "restitution in Plaintiffs favor I was ordered to leave the property",
        "I have satisfied any money awards ordered in the judgment",
        "Judgment was entered on date"
      ],
      tooltip: "To be eligible five years must have passed since the judgement and all money owed in the judgement must be paid off",
    },
    {
      id: "judgementDate",
      label: "Date of Judgement",
      evictionPdfFields: ["which is more than"],
      disabled: (fieldState) => !fieldState.restitution,
    },
    {
      id: "covidTimes",
      label: "Covid Eligible",
      checkbox: true,
      evictionPdfFields: ["Judgment was based on claims that arose on or after April 1 2020 and before"],
      tooltip: "Check this if the claims arose between April 1, 2020 and March 1, 2022",
    },
    {
      id: "stipulated",
      label: "Stipulated Agreement",
      checkbox: true,
      evictionPdfFields: ["stipulation agreement ", "I have satisfied all terms of the agreement and paid any money required"],
      tooltip: "Check that client has satisfied all the terms of the agreement. If they haven't this could prompt the landlord to file a declaration of non-compliance to evict the tenant.",
    },
    
  ]
],
[
  "Attorney Information",
  [
    {
      id: "attorneyName",
      label: "Attoreny Name",
      evictionPdfFields: ["Attorney Name", "Text4", "Text5"],
    },
    {
      id: "barNumber",
      label: "Bar Number",
      evictionPdfFields: ["Text9"],
    },
  ]
]
];

// This is just another way to access the same information, but in a single array instead of in sections.
export const EVICTION_FLATTENED_FIELDS: EvictionFormField[] =
EVICTION_FIELDS_IN_SECTIONS.flatMap(([, fields]) => fields);

const INITIAL_FIELD_STATE = {
  casenumber: "",
  county: "",
  plaintiff: "",
  plaintiffAddress: "",
  defendant: "",
  fullname: "",
  address: "",
  cityState: "",
  phone: "",
  dismissed: false,
  restitution: false,
  judgementDate: "",
  covidTimes: false,
  stipulated: false,
  attorneyName: "",
  barNumber: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  casenumber: "23LT",
  county: "Multnomah",
  plaintiff: "Landlord",
  plaintiffAddress: "701 N Killingsowth St., Portland, OR 97212",
  defendant: "Stacy",
  fullname: "Stacy's Mom",
  address: "1805 N Webster St.",
  cityState: "Portland, OR 97217",
  phone: "(971) 722-5258",
  dismissed: false,
  restitution: false,
  judgementDate: "",
  covidTimes: false,
  stipulated: false,
  attorneyName: "Alena Tupper",
  barNumber: "111869",
};

function EvictionForm() {
  const [fieldState, setFieldState] = useState<any>(INITIAL_FIELD_STATE);
  const [invalidState, setInvalidState] = useState<any>(INITIAL_INVALID_STATE);
  const [anyInputsInvalid, setAnyInputsInvalid] = useState(false);
  const [isValidationDisabled, setIsValidationDisabled] = useState(false);

  const handleEvictionExpungementSubmit = () => {
    if (
      !isValidationDisabled &&
      !validate(fieldState, setInvalidState, setAnyInputsInvalid)
    )
      return;
    fillAndDownloadEvictionExpungement(fieldState);
  };

  return (
    <div className="FormFillingPage">
      <div className="row">
        <FillableFieldsSet
          FIELDS_IN_SECTIONS={EVICTION_FIELDS_IN_SECTIONS}
          fieldState={fieldState}
          invalidState={invalidState}
          setFieldState={setFieldState}
          setIsValidationDisabled={setIsValidationDisabled}
        />
        <div>
          <div className="card">
            <button onClick={() => handleEvictionExpungementSubmit()}>
              Download
            </button>
          </div>

          {anyInputsInvalid && (
            <div className="pleaseComplete">
              Please complete all highlighted fields
            </div>
          )}
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => setFieldState(DEMO_INITIAL_FIELD_STATE)}
        >
          Populate fields
        </Button>
      </div>
      <div>
        <Checkbox
          value={isValidationDisabled}
          onChange={() => setIsValidationDisabled((oldState) => !oldState)}
        />{" "}
        Disable Validation
      </div>
    </div>
  );
}

export default EvictionForm;
