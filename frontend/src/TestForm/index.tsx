import React, { useState } from "react";
import FillableFieldsSet from "../components/FillableFieldsSet";
import { Button, Checkbox } from "@mui/material";
import { Field } from "../components/inputHandlersAndTypes";
import OeciLogin from "../components/OeciLogin";

export type EvictionFormField = Field & {
  evictionPdfFields?: string[];
};

export const EVICTION_FIELDS_IN_SECTIONS: [
  React.ReactNode,
  EvictionFormField[],
][] = [
  [
    "Case Information",
    [
      {
        id: "caseNumber",
        label: "Case Number",
        required: true,
        evictionPdfFields: ["Case No"],
      },
    ],
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
    ],
  ],
  [
    "Plaintiff Information",
    [
      {
        id: "plaintiff1",
        label: "Plaintiff 1",
      },
      {
        id: "plaintiff1Address",
        label: "Plaintiff 1 Address",
      },
      {
        id: "plaintiff2",
        label: "Plaintiff 2",
      },
      {
        id: "plaintiff2Address",
        label: "Plaintiff 2 Address",
      },
    ],
  ],
];

// This is just another way to access the same information, but in a single array instead of in sections.
export const EVICTION_FLATTENED_FIELDS: EvictionFormField[] =
  EVICTION_FIELDS_IN_SECTIONS.flatMap(([, fields]) => fields);

const INITIAL_FIELD_STATE = {
  caseNumber: "",
  attorneyName: "",
  barNumber: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  caseNumber: "23LT04550",
  attorneyName: "Alena Tupper",
  barNumber: "111869",
};

function TestForm() {
  const [fieldState, setFieldState] = useState<any>(INITIAL_FIELD_STATE);
  const [isValidationDisabled, setIsValidationDisabled] = useState(false);

  const handleSubmit = () => {};

  async function fetchPlaintiffInfo() {
    const postData = {
      case_number: fieldState["caseNumber"],
    };

    console.log(postData);
    fetch("/api/oeci_scrape/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(async (response) => {
        console.log("fetch response", response);

        if (!response.ok) {
          throw new Error(await response.text());
        }

        return response.text();
      })
      .then((data) => {
        console.log("Success:", data); // Handle the response data
        const jsonData = JSON.parse(data);
        const newData = {
          plaintiff1: jsonData.plaintiffs[0],
          plaintiff1Address: jsonData.addresses[0].join(", "),
          plaintiff2: jsonData.plaintiffs[1],
          plaintiff2Address: jsonData.addresses[1].join(", ")
        }
        setFieldState({...fieldState, ...newData})
      })
      .catch((error) => {
        alert(error); // Handle errors
      });
  }

  return (
    <div className="FormFillingPage">
      <OeciLogin />
      <div className="row">
        <FillableFieldsSet
          FIELDS_IN_SECTIONS={EVICTION_FIELDS_IN_SECTIONS}
          fieldState={fieldState}
          invalidState={false}
          setFieldState={setFieldState}
          setIsValidationDisabled={setIsValidationDisabled}
        />
        <div>
          <div className="card">
            <button onClick={() => handleSubmit()}>
              Download PDF
            </button>
          </div>
          <div className="card">
            <button onClick={() => fetchPlaintiffInfo()}>Fetch Case Details</button>
          </div>
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

export default TestForm;
