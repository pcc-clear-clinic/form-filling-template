
export const handleChange = (e: React.BaseSyntheticEvent, setFieldStateFn : (arg0: any)=>void) => {
  setFieldStateFn((oldState: any) => {
    return {
      ...oldState,
      [e.target.id]: e.target.value,
    };
  });
};

export const handleCheckboxChange = (fieldId: string, setFieldStateFn: (arg0: any)=>void) => {
  setFieldStateFn((oldState: any) => {
    return {
      ...oldState,
      [fieldId]: !oldState[fieldId],
    };
  });
};


export type Field = {
  id: string;
  label: string;
  required?: boolean;
  validation?: (arg: any, fieldState: any) => boolean;
  selectionList?: string[];
  checkbox?: boolean;
  disabled?: (arg0: any) => boolean;
  tooltip?: string;
};