import { FLATTENED_FIELDS } from ".";

type TInvalidState = {
  fullname: boolean;
  dob: boolean;
  numberInHousehold: boolean;
};

export const INITIAL_INVALID_STATE = {
  fullname: false,
  dob: false,
  numberInHousehold: false,
};

export default function validate(
  form: "feeWaiver" | "statewidePacket",
  fieldState: any,
  setInvalidState: (arg0: any) => void,
  setAnyInputsInvalid: (arg0: boolean) => void,
) {
  let foundInvalid = false;
  FLATTENED_FIELDS.forEach((field) => {
      if (
        field.required &&
        fieldState[field.id] === "" &&
        ((form === "feeWaiver" && field.pdfFields))
      ) {
        foundInvalid = true;
        setInvalidState((oldState: TInvalidState) => ({
          ...oldState,
          [field.id]: true,
        }));
      } else if (
        field.validation &&
        !field.validation(fieldState[field.id] as string, fieldState)
      ) {
        foundInvalid = true;
        setInvalidState((oldState: TInvalidState) => ({
          ...oldState,
          [field.id]: true,
        }));
      } else {
        setInvalidState((oldState: TInvalidState) => ({
          ...oldState,
          [field.id]: false,
        }));
      }
    });

  setAnyInputsInvalid(foundInvalid);
  return !foundInvalid;
}
