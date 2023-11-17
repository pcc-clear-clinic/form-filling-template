import { PDFDocument, PDFCheckBox, PDFAcroRadioButton } from "pdf-lib";
import fetch from "node-fetch";
import fs from "fs/promises"; // Importing fs promises-based module

export async function examinePdf() {
  const formUrl = "https://wittejm.github.io/clearclinic/FeeWaiver.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();
  console.log("Fields from source:", formUrl);

  form.getFields().forEach((field) => {
    console.log(field.getName(), field instanceof PDFCheckBox ? "Checkbox" : field instanceof PDFAcroRadioButton ? "Radio" : "Text" );
    if (!(field instanceof PDFCheckBox) && !(field instanceof PDFAcroRadioButton  )){
      const myField = form.getTextField(field.getName());
      myField.setText(field.getName());
    }
  });

  const outputPath = "filledForm.pdf";
  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, modifiedPdfBytes);

}

examinePdf();
