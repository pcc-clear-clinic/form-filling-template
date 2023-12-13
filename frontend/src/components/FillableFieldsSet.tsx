import { FieldEntry } from "./FieldEntry";
import {
  Field,
  handleChange,
  handleCheckboxChange,
} from "./inputHandlersAndTypes";

type Props = {
  FIELDS_IN_SECTIONS: [React.ReactNode, Field[]][];
  fieldState: any;
  invalidState: any;
  setFieldState: any;
  setIsValidationDisabled: any;
};

export default function FillableFieldsSet({ FIELDS_IN_SECTIONS, fieldState , invalidState, setFieldState, setIsValidationDisabled }: Props) {
  return (
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
                    handleChange={(e) => handleChange(e, setFieldState)}
                    handleCheckboxChange={(e) =>
                      handleCheckboxChange(e, setFieldState)
                    }
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
  );
}
