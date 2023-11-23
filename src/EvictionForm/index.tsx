import React, { useState } from "react";
import { FieldEntry } from "../components/FieldEntry";
import { fillAndDownloadEvictionExpungement } from "./fillAndDownload";
import validate, { INITIAL_INVALID_STATE } from "./validate";
import { COUNTIES } from "../components/constants";
import { handleChange, handleCheckboxChange } from "../components/inputHandlers";

export type EvictionFormField = {
  id: string;
  label: string;
  required?: boolean;
  validation?: (arg: any, fieldState: any) => boolean;
  selectionList?: string[];
  pdfFields?: string[];
  checkbox?: boolean;
  disabled?: (arg0: any) => boolean;
  tooltip?: string;
};

export const FIELDS_IN_SECTIONS: [React.ReactNode, EvictionFormField[]][] = [
  [
    "Section 1",
    [
      {
        id: "county",
        label: "Filing County",
        selectionList: COUNTIES,
        required: true,
        pdfFields: ["IN THE CIRCUIT COURT OF THE STATE OF OREGON"],
        tooltip: "some explanation",
      },
      {
        id: "fullname",
        label: "Name (First Middle Last)",
        required: true,
        pdfFields: ["IN THE CIRCUIT COURT OF THE STATE OF OREGON"],
      },
    ],
  ],
  ["Section 2", []],
];

export const FLATTENED_FIELDS: EvictionFormField[] = FIELDS_IN_SECTIONS.flatMap(
  ([, fields]) => fields,
);

const INITIAL_FIELD_STATE = {
  fullname: "",
  county: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  fullname: "Quinn Doe",
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
      !validate(
        "statewidePacket",
        fieldState,
        setInvalidState,
        setAnyInputsInvalid,
      )
    )
      return;
    fillAndDownloadEvictionExpungement(fieldState);
  };

  return (
    <div className="FormFillingPage">
      <div className="row">
        <div>
          <form>
            {FIELDS_IN_SECTIONS.map((section) => {
              return (
                <>
                  <h3>{section[0]}</h3>
                  {section[1].map((field) => {
                    return (
                      <FieldEntry
                        id={field.id}
                        label={field.label}
                        required={field.required}
                        checkbox={field.checkbox}
                        selectionList={field.selectionList}
                        disabled={field.disabled}
                        handleChange={(e)=>handleChange(e, setFieldState)}
                        handleCheckboxChange={(e)=>handleCheckboxChange(e, setFieldState)}
                        fieldState={fieldState}
                        invalidState={invalidState}
                        tooltip={field.tooltip}
                        key={field.id}
                      />
                    );
                  })}
                </>
              );
            })}
          </form>
        </div>
        <div>
          <div className="card">
            <button onClick={() => handleEvictionExpungementSubmit()}>
              Download Statewide Packet
            </button>
          </div>

          {anyInputsInvalid && (
            <div className="pleaseComplete">
              Please complete all highlighted fields
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvictionForm;
