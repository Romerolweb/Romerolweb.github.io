# cv.json guide

`cv.json` is a [JSON Resume v1.0.0](https://jsonresume.org/schema/) document. The vendored copy of the schema is `schema/resume.schema.json`; `scripts/validate-cv.py` checks the file against it with no dependencies. The top level accepts only the schema's sections (`basics`, `work`, `volunteer`, `education`, `awards`, `certificates`, `publications`, `skills`, `languages`, `interests`, `references`, `projects`, `meta`). Anything else, such as services, goes in its own file.

## One extension: categorized_highlights

Each work entry may carry `categorized_highlights`, an object whose keys are role names and whose values are arrays of strings. The plain `highlights` array is still accepted and is always shown. Use the same role names across entries so the filter chips stay short.

```json
"categorized_highlights": {
  "Software Engineer": ["..."],
  "DevOps": ["..."],
  "Leadership": ["..."]
}
```

## Field notes

| Section | Keep in mind |
|---|---|
| `basics` | `name`, `label`, `summary`, `url`, `location`, `profiles`. Leave `email` and `phone` out unless you want them public; the pages show them only when present. Each profile needs `network`, `username`, `url`, and the template's extra `icon` (a Font Awesome class). |
| `work` | `name`, `position`, `startDate`, optional `endDate`, `location`, `summary`, `url`, `highlights` or `categorized_highlights`. Reverse-chronological order; the pages render in file order. |
| `education` | `institution`, `studyType`, `area`, dates, optional `score`, `courses`, `url`. The pages print `studyType, area`, so "Master" + "Information Technology" reads as "Master, Information Technology". |
| `skills` | Groups with `name` and `keywords`. These keywords also feed the hero animation on the portfolio. |
| `projects` | `name`, `description`, optional `highlights`, `keywords`, `url`. Link only to things that are public; a private repository is a dead link on a CV. |
| `certificates`, `awards`, `publications`, `languages` | Standard schema fields. Sections with no entries are hidden on the CV page. |
| `meta` | Keep `canonical` and `version` as they are; bump `lastModified` when you edit. |

Dates are `YYYY-MM-DD`, `YYYY-MM`, or `YYYY`. Never `"Present"`, never `""`.

## A complete work entry

```json
{
  "name": "Acme Payments",
  "position": "Senior Software Engineer",
  "url": "https://acme.example",
  "startDate": "2024-02",
  "location": "Melbourne, Australia (Hybrid)",
  "summary": "Payments platform serving 2 million monthly users (Go, PostgreSQL, Kubernetes).",
  "categorized_highlights": {
    "Software Engineer": [
      "Cut checkout latency 40% for all merchants by moving fraud scoring from a synchronous call to an event-driven pipeline.",
      "Led the migration of the ledger service from Python to Go, retiring 30k lines and halving on-call pages."
    ],
    "DevOps": [
      "Introduced progressive delivery with Argo Rollouts, bringing failed-release rollback from 25 minutes to under 2."
    ],
    "Leadership": [
      "Mentored two graduates through their first production launches and wrote the team's incident review template."
    ]
  }
}
```

Notice what each bullet does: outcome first, a number where one exists, the technology named once, nothing an outsider should not know.

## services.json

An array of `{ "name", "keywords": [], "description" }`. The portfolio shows the name and keywords on a card and the description in a modal. Use `[]` to hide the section.
