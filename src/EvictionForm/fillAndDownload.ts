import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import { FLATTENED_FIELDS, EvictionFormField } from ".";

const FEE_WAIVER_CHECKED_LIST : string[] = [
  // List the names of fields that should be checked.
  // "example1"
];

export async function fillAndDownloadEvictionExpungement(fieldState: any) {
  const formUrl = "https://wittejm.github.io/clearclinic/FeeWaiver.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  FLATTENED_FIELDS.forEach((field : EvictionFormField) => {
    if (field.pdfFields) {
      field.pdfFields.forEach((pdfField) => {
        if (field.checkbox) {
          if (fieldState[field.id]) {
            field.pdfFields?.forEach((pdfField) =>
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
  FEE_WAIVER_CHECKED_LIST.forEach((field) => form.getCheckBox(field).check());


  form
    .getTextField("Name printed")
    .setText(
      `${fieldState["streetAddress"]}${new Array(
        Math.max(1, 60 - fieldState["streetAddress"].length),
      )
        .fill(" ")
        .join("")}${fieldState["cityStateZip"]}${new Array(
        Math.max(1, 60 - fieldState["cityStateZip"].length),
      )
        .fill(" ")
        .join("")}${fieldState["phone"]}`,
    );

  // Compute:
  if (!["", "0"].includes(fieldState.snap.trim())) {
    form
      .getCheckBox("Food Stamps SNAPSupplemental Nutrition Assistance Program")
      .check();
  }
  if (!["", "0"].includes(fieldState.ssi.trim())) {
    form.getCheckBox("Supplemental Security Income SSI").check();
  }
  if (!["", "0"].includes(fieldState.tanf.trim())) {
    form.getCheckBox("Temporary Assistance to Needy Families TANF").check();
  }

  const totalBenefits =
    (fieldState.snap ? parseFloat(fieldState.snap) : 0) +
    (fieldState.tanf ? parseFloat(fieldState.tanf) : 0) +
    (fieldState.ssi ? parseFloat(fieldState.ssi) : 0);

  const totalBenefitsField = form.getTextField(
    "Total monthly benefits received",
  );
  totalBenefitsField.setText(`${totalBenefits.toFixed(2)}`);

  const totalMonthyIncome =
    (fieldState.totalMonthlyIncomeJobs
      ? parseFloat(fieldState.totalMonthlyIncomeJobs)
      : 0) +
    (fieldState.totalMonthlyIncomeOther
      ? parseFloat(fieldState.totalMonthlyIncomeOther)
      : 0);
  const totalIncomeField = form.getTextField("TOTAL INCOME FROM ALL SOURCES");
  totalIncomeField.setText(`${totalMonthyIncome.toFixed(2)}`);

  const totalAssets =
    (fieldState.totalCash ? parseFloat(fieldState.totalCash) : 0) +
    (fieldState.valueOtherAssets ? parseFloat(fieldState.valueOtherAssets) : 0);
  const totalAssetsField = form.getTextField("TOTAL VALUE OF ALL ASSETS  CASH");
  totalAssetsField.setText(`${totalAssets.toFixed(2)}`);

  const totalMonthyExpenses =
    (fieldState.homeExpenses ? parseFloat(fieldState.homeExpenses) : 0) +
    (fieldState.transportationExpenses
      ? parseFloat(fieldState.transportationExpenses)
      : 0) +
    (fieldState.otherExpenses ? parseFloat(fieldState.otherExpenses) : 0);
  const totalExpensesField = form.getTextField(
    "student loans day care court fines medical child support credit cards etc",
  );
  totalExpensesField.setText(`${totalMonthyExpenses.toFixed(2)}`);

  const todaysDateField = form.getTextField("Date");
  todaysDateField.setText(format(new Date(), "MM/dd/yyyy"));

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "feeWaiverFilled.pdf";
  link.click();
}