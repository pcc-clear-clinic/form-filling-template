
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