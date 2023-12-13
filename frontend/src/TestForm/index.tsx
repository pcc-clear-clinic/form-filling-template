import React, { useState } from "react";
import FillableFieldsSet from "../components/FillableFieldsSet";
import { Button, Checkbox } from "@mui/material";
import { Field } from "../components/inputHandlersAndTypes";

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
        id: "casenumber",
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
];

// This is just another way to access the same information, but in a single array instead of in sections.
export const EVICTION_FLATTENED_FIELDS: EvictionFormField[] =
  EVICTION_FIELDS_IN_SECTIONS.flatMap(([, fields]) => fields);

const INITIAL_FIELD_STATE = {
  casenumber: "",
  attorneyName: "",
  barNumber: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  casenumber: "23LT",
  attorneyName: "Alena Tupper",
  barNumber: "111869",
};

function TestForm() {
  const [fieldState, setFieldState] = useState<any>(INITIAL_FIELD_STATE);
  const [isValidationDisabled, setIsValidationDisabled] = useState(false);

  const handleEvictionExpungementSubmit = () => {
    
  };

  return (
    <div className="FormFillingPage">
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
            <button onClick={() => handleEvictionExpungementSubmit()}>
              Download
            </button>
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
