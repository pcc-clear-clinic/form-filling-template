import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import { EVICTION_FLATTENED_FIELDS, EvictionFormField } from ".";



const CHECKED_LIST : string[] = [
  // List the names of fields that should be checked.
  "Maik"
];

export async function fillAndDownloadEvictionExpungement(fieldState: any) {
  const formUrl = "https://pccclearclinic.github.io/form-filling/pdfs/EvictionExpungement.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  EVICTION_FLATTENED_FIELDS.forEach((field : EvictionFormField) => {
    if (field.evictionPdfFields) {
      field.evictionPdfFields.forEach((pdfField) => {
        if (field.checkbox) {
          if (fieldState[field.id]) {
            field.evictionPdfFields?.forEach((pdfField) =>
              form.getCheckBox(pdfField).check(),
            );
          }
        } else {
          const formField = form.getTextField(pdfField);
          formField.setText(fieldState[field.id]);
        }
      });
    }
  });

  // Always-checked fields:
  CHECKED_LIST.forEach((field) => form.getCheckBox(field).check());

  // Any pdf fields that need to be computed and populated other than from input fields go here
  const todaysDateField = form.getTextField("Date");
  todaysDateField.setText(format(new Date(), "MM/dd/yyyy"));

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${casenumber.value}SetAside.pdf`;
  link.click();
}
