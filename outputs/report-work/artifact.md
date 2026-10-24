# Template execution contract

## Reference and fidelity evidence
- Reference: `C:\Users\Lenovo\OneDrive\Documents\Mini Project Report Format 2026-27 (SEM-I).docx`
- SHA-256: `F5B56D33520A0E7CD4CA0D1931CED655AD961DA12B08D769BB6F9E0B627F383E`
- One portrait A4 section; source package inspected read-only; preserve source unchanged.
- Source style evidence: `outputs/report-work/template-style-evidence.json`; project task notes include an earlier extracted template outline.
- Rendering: packaged renderer cannot find LibreOffice and Word COM is sandbox-denied. Rendering path remains an explicit QA requirement; attempt Word export only after authoring.

## Page system
- A4 portrait, one section. Actual section audit margins L/R/T/B = 1.0/1.0/1.0/0.88 inches; template's printed general instructions request 1.5/0.5/1.0/1.0 inches. Keep actual source geometry to preserve the file, and retain its one-section layout.
- Template has one embedded institutional logo, no tables, no page borders, no explicit page-break elements, and an outline in body paragraphs. Reuse its actual logo on the cover; clear blank/template-outline body paragraphs and construct report body in the same copied file.
- Typography per instructions: Times New Roman, 12 pt body, 16 pt bold chapter titles, black text. Retain formal academic style. Use readable heading hierarchy and figure captions. Add page numbers and right-aligned chapter running heading only if implementation remains compatible with template section.

## Flow and content slots
- Front matter: cover/title page, certificate, student declaration, abstract, contents, abbreviations, lists of figures/tables/screenshots.
- Chapters: 1 Introduction; 2 Literature Survey; 3 System Development (requirements, architecture, DFD levels 0/1/2, use cases/sequence, database/ER, UI, eligibility logic); 4 Performance Evaluation (tests/results/limits); 5 Conclusion and future scope; References; Acknowledgement.
- Write for SEM-I readers in plain English; explain terms before use. Do not treat instructions printed in source template as user-authored project claims. Leave unknown student, roll, guide, and institute details as conspicuous fill-in fields.
- Base implementation claims on inspected YojanaMitra source. Clearly distinguish implemented behaviour, test evidence, and recommendations. Do not claim scheme facts are verified, AI can guarantee eligibility, jobs are current, or production performance was measured.

## Visuals
- Use genuine local YojanaMitra screenshots only: current assistant screen `C:\Users\Lenovo\OneDrive\Pictures\Screenshots\Screenshot 2026-10-16 170613.png` and profile page `C:\Users\Lenovo\OneDrive\Pictures\Screenshots\Screenshot 2026-10-16 134820.png`. Crop browser chrome if useful but describe all crops truthfully; redact/avoid personal account data (profile screenshot only shows app profile UI; inspect before use).
- Generate clean vector-like raster diagrams for system architecture, DFD levels 0/1/2, use-case/user flow, ER model, eligibility decision, and AI request/voice flow. Explain each figure in nearby prose and caption it.

## Package and preservation
- Start from a copy of the reference DOCX, not a blank document. Keep original file unchanged and record same SHA before/after.
- Reuse the actual logo and source section geometry. Preserve relevant image relationship; source's template-outline text may be replaced because it is the intended content slot. Do not include template instructions as report prose.
- Output: `outputs/YojanaMitra_Mini_Project_Report_2026-27.docx`.
