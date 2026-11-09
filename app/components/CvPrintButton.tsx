"use client";

export default function CvPrintButton() {
  return (
    <button className="main-button print-button" type="button" onClick={() => window.print()}>
      Cetak / simpan sebagai PDF
    </button>
  );
}
