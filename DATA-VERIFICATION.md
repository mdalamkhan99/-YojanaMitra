# Scheme data verification

The seed catalog contains 30 named schemes and opportunity/recruitment portals. On 2026-10-16, the first five MahaDBT records were checked against their direct official scheme pages and seeded with the confirmed category/income rules, source URLs, documents and verification dates. Course, renewal, CAP, family-beneficiary, attendance or other conditions that the profile cannot represent remain manual checks, so matching profiles return “Maybe.” The OBC tuition/exam fee page does not state an income limit; the app leaves that limit unspecified. Current application deadlines remain “Check official site.” A tracking sheet at `outputs/scheme-verification-tracker.xlsx` records the review and leaves the other 25 rows clearly unverified.

MahaDBT's notice says fresh and renewal applications for AY 2026-27 go through the MahaDBT 2.0 portal. Do not reuse past-cycle dates. The VJNT page currently lists an annual income limit of ₹2.5 lakh; an older page has ₹1.5 lakh, so the seeded value uses the current detail page and the tracking sheet records that discrepancy.

For the remaining records, open each official link and locate the current scheme/exam notification. Check the application cycle, eligibility, income/category/course conditions, benefits, documents, deadline and application route. Update data only from an official government, regulator, exam authority or employer source. Save a `lastVerified` date after checking. Recheck every 2–3 months and at each new academic/recruitment cycle. Never treat an eligibility match as an award guarantee.

Admin accounts can create/edit entries through `/api/admin/schemes` (the admin route is role-checked). Bulk import a JSON array using `npm run schemes:import -w server -- ./schemes.json`. Each object should provide `title`, `type` (`scholarship`, `govt_job`, `private_job`, `internship`), `provider`, `officialLink`, and `sourceUrl`; optional fields include `rules`, `benefits`, `documents`, `deadline`. Example:

```json
[{"title":"Example official opportunity","type":"scholarship","provider":"Issuing authority","officialLink":"https://example.gov.in/","sourceUrl":"https://example.gov.in/","rules":{},"benefits":"See official notice","documents":["As listed in notice"],"deadline":"Check official site"}]
```
