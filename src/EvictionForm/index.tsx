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
][] = [
  [
    "Section 1",
    [
      {
        id: "county",
        label: "Filing County",
        selectionList: COUNTIES,
        required: true,
        evictionPdfFields: ["IN THE CIRCUIT COURT OF THE STATE OF OREGON"],
        tooltip: "some explanation",
      },
      {
        id: "fullname",
        label: "Name (First Middle Last)",
        required: true,
        evictionPdfFields: ["v 1"],
      },
    ],
  ],
  ["Section 2", []],
];

export const EVICTION_FLATTENED_FIELDS: EvictionFormField[] =
EVICTION_FIELDS_IN_SECTIONS.flatMap(([, fields]) => fields);

const INITIAL_FIELD_STATE = {
  fullname: "",
  county: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  fullname: "Fake name",
  county: "",
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
