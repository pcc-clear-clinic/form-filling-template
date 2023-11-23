export const handleChange = (
  e: React.BaseSyntheticEvent,
  setFieldStateFn: (arg0: any) => void,
) => {
  setFieldStateFn((oldState: any) => {
    return {
      ...oldState,
      [e.target.id]: e.target.value,
    };
  });
};

export const handleCheckboxChange = (
  fieldId: string,
  setFieldStateFn: (arg0: any) => void,
) => {
  setFieldStateFn((oldState: any) => {
    return {
      ...oldState,
      [fieldId]: !oldState[fieldId],
    };
  });
};

export type Field = {
  id: string; // must be unique
  label: string; // The shown text for this input
  required?: boolean; //if true, the field is checked in validation
  validation?: (arg: any, fieldState: any) => boolean; //this function performs validation logic that returns true (valid) or false.
  selectionList?: string[]; // providing this makes the input field a dropdown
  checkbox?: boolean; // setting this to true makes the field a checkbox
  disabled?: (fieldState: any) => boolean; // this function takes the form's fieldState and returns true if the field should be disabled
  tooltip?: string; // Adds mouseover text
};
