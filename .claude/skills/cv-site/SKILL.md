---
name: cv-site
description: Build, update, validate, and publish a personal CV and portfolio site from this JSON Resume template (cv.json + services.json rendered by vanilla HTML/CSS/JS, deployed on GitHub Pages). Use this skill whenever someone wants to turn this repository into their own resume site, add or rewrite a job, project, or skill in cv.json, make the CV friendlier to applicant tracking systems or OCR, print the CV to PDF, change colours or layout, add a role filter, set up GitHub Pages or a custom domain, or asks "how do I use this template" in any wording. Also use it for plain requests like "add my new job" or "update my resume" when the working directory contains cv.json.
---

# CV site

One repository, two pages, two data files. `index.html` is the portfolio; `views/cv.html` is the printable, ATS-friendly CV. Both read `cv.json` (a JSON Resume v1.0.0 document) and the portfolio also reads `services.json`. There is no build step, so every change is "edit JSON, reload".

## Where things live

| Path | What it is | Touch it when |
|---|---|---|
| `cv.json` | All CV content, JSON Resume v1.0.0 plus one extension | Any content change |
| `services.json` | Cards for the Services section (array, `[]` hides it) | Offering consulting or freelance work |
| `schema/resume.schema.json` | Vendored schema the validator uses | Never, unless upgrading the schema version |
| `scripts/validate-cv.py` | Dependency-free validator | After every edit to cv.json |
| `assets/css/tokens.css` | Colours, type scale, spacing, radii, shadows | Changing the look |
| `assets/css/site.css`, `assets/css/cv.css` | Portfolio and CV styles, consume the tokens | Layout changes |
| `assets/js/cv-utils.js` | Role aliases, date formatting, role chips, shared helpers | Adding a role or alias |
| `assets/js/site.js`, `assets/js/cv.js` | Rendering for each page | New sections or fields |
| `CNAME` | Custom domain for GitHub Pages | Pointing a domain at the site |

Read `references/cv-json-guide.md` before writing cv.json content. It has the field-by-field contract, the `categorized_highlights` convention, and a complete worked example of a work entry.

## Setting the template up for a new person

1. Replace the owner's data, not the structure. Rewrite `basics`, `work`, `education`, `skills`, `projects`, `languages`; delete `awards`, `publications`, and `certificates` if the person has none (the CV hides empty sections). Replace `services.json` or set it to `[]`.
2. Replace `CNAME` with the new domain or delete the file. Replace the two icons in `assets/img/`. Update the name and description in the `<head>` of both HTML pages, the `<h1>` fallback in the hero, and the footer line. Grep the repository for the previous owner's name to catch stragglers.
3. Run `python3 scripts/validate-cv.py`. Fix every reported problem; the validator exits non-zero so it can run in CI.
4. Preview with `python3 -m http.server 8000`, open both pages, and check the browser console is empty. Click through the role chips on both pages. Print `views/cv.html` to PDF and look at the first page: it should be full, with no half-empty page caused by a long first entry.
5. Grep for emails, phone numbers, and secrets before the first push. The template deliberately keeps email out of cv.json and links to social profiles instead; recruiters reach people through LinkedIn, and a public email on a static site is harvested within days.
6. Push to `<user>.github.io` (or enable Pages on any repository). For a custom domain, add the four A records `185.199.108.153` to `185.199.111.153`, the AAAA records if the registrar supports them, a `www` CNAME to `<user>.github.io`, and turn on Enforce HTTPS once the DNS check passes. A `.dev` or `.app` domain refuses plain HTTP, so the site will not open at all until the certificate is issued.

## Writing content that works for machines and people

The CV view exists so that an applicant tracking system, an OCR pass, or a recruiter skimming a PDF all get the same story. The rules below follow from that:

- Lead each highlight with the outcome, then the method. "Made search 89% faster for members by …" beats "Migrated search to full-text search". A number in the first six words is what a human remembers and what a parser can extract.
- Keep company know-how out. Describe the shape of the work (what changed for users, which technologies, the scale) without the internal names of workflows, data, or vulnerabilities. If a sentence would help a competitor or an attacker, cut the detail and keep the result.
- Paraphrase, do not embellish. Use only facts the person gave you; a word like "cross-team" or a date you guessed becomes a claim they have to defend in an interview. When something is missing, put a visible `TODO` in the field and say so in your reply instead of inventing it.
- A new current role rarely changes only `work`. Update the last sentence of `basics.summary` and the About Me paragraph in the README in the same change, otherwise the CV introduces the person with a job they no longer lead with.
- One role, one entry. Two positions at the same company are two entries with their own dates; parsers key on date ranges.
- Dates are `YYYY-MM` or `YYYY`. Omit `endDate` for a current role; never write "Present", the schema rejects it and the pages already render a missing end date as Present.
- Omit empty fields rather than writing `""`. An empty `url` or `email` fails the `uri` and `email` formats in the schema.
- Keep the CV view plain. No icons, no second column, no images, no text-align justify. Section headings stay as the standard words parsers look for: Summary, Skills, Work Experience, Education, Projects, Publications, Awards, Certifications, Languages.

## Role filters

`work[].categorized_highlights` groups bullets under role names such as `Software Engineer`, `DevOps`, `Leadership`, `Data`. The chips on both pages and the `?role=` URL parameter filter by those names, and the role travels with the reader between the two pages. To add a role, use it as a key in cv.json; to give it a short alias for URLs (`?role=do`), add it to `roleAliases` in `assets/js/cv-utils.js`.

## Changing the look

Edit `assets/css/tokens.css` first. Brand colour, accent, neutrals, type scale, and spacing are all tokens, and the hero animation reads `--color-brand` and `--color-accent` at runtime. Only reach for `site.css` when a component needs a new shape. Do not reintroduce a CSS framework CDN; the template dropped it on purpose (see `docs/ADR/001-drop-tailwind-cdn-for-css-tokens.md`).

## Before you say it is done

- `python3 scripts/validate-cv.py` passes.
- Both pages load with an empty console; the role chips, the mobile menu, and the services modal work.
- The printed CV starts on a full first page and no entry heading is orphaned at the bottom of a page.
- No personal email, phone number, or secret is in the repository or its history.
