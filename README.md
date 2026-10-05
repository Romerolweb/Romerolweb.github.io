# Sebastian Romero Laguna - Professional Resume

[![Live Site](https://img.shields.io/badge/Live-Site-purple)](https://romerolweb.github.io/)
[![Built with HTML/JS](https://img.shields.io/badge/Built%20with-HTML%2FJS-yellow)](https://developer.mozilla.org/en-US/docs/Web/HTML)

Responsive resume/portfolio website built with vanilla HTML, CSS, and JavaScript. No build step.

## 🚀 Features

- **No dependencies**: Vanilla HTML/CSS/JS with a small token-based design system (`assets/css/tokens.css`)
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Data Driven**: All content is loaded from `cv.json`, a valid [JSON Resume](https://jsonresume.org/schema/) v1.0.0 file, plus `services.json`
- **Role-Based CV**: Dynamically filter resume content based on target role
- **Interactive Components**: Dynamic navigation, hero animation
- **ATS-friendly CV**: `views/cv.html` renders a single-column, icon-free, printable CV for applicant tracking systems and OCR
- **Professional Sections**: About, Experience, Skills, Education, Services, Contact

## 🛠️ Technologies Used

- **Vanilla HTML/CSS/JavaScript** - no framework, no build step
- **Font Awesome 6** - social icons on the portfolio page only (via CDN)
- **Design tokens** - colours, type scale, spacing, radii and shadows live in `assets/css/tokens.css` and are consumed by `assets/css/site.css` (portfolio) and `assets/css/cv.css` (printable CV)

## 🔁 Use It for Your Own CV

Everything you need to change lives in two JSON files. There is no build step.

1. Fork or clone this repository.
2. Replace the contents of `cv.json` with your own data. It follows the [JSON Resume v1.0.0 schema](schema/resume.schema.json) with one extension: `work[].categorized_highlights` (see below). Leave `endDate` out for a current role.
3. Replace `services.json` with the services you offer, or an empty array `[]` to hide the section.
4. Validate: `python3 scripts/validate-cv.py` (no dependencies).
5. Preview locally: `python3 -m http.server 8000`, then open `http://localhost:8000`.
6. Swap `assets/img/favicon.png` and `assets/img/apple-touch-icon.png`, and change the colours in `assets/css/tokens.css` if you like.
7. Push to a repository named `<your-user>.github.io` and GitHub Pages serves it. For a custom domain, edit `CNAME` and point your DNS at GitHub Pages.

The printable CV at `views/cv.html` is deliberately plain so that applicant tracking systems and OCR tools can read it. Keep it that way: no icons, no columns, no images.

If you use Claude Code, the repository ships a skill under `.claude/skills/` that walks through these steps and checks the result.

## 🎯 Role-Based Resume Generation

This portfolio supports generating role-specific views of your resume by filtering the content in `cv.json`. This is useful for tailoring your CV for specific job applications (e.g., "DevOps Engineer" vs "Software Engineer").

### How to Use

Append the `?role=<role_name>` query parameter to the URL.

**Examples:**
- `https://romerolweb.github.io/?role=DevOps` (Shows DevOps highlights)
- `https://romerolweb.github.io/?role=Software Engineer` (Shows Software Engineer highlights)
- `https://romerolweb.github.io/views/cv.html?role=do` (Use alias 'do' for DevOps in the print view)

### Supported Aliases

You can use the following abbreviations in the URL:

| Role | Aliases |
|------|---------|
| **DevOps** | `do`, `devops` |
| **Software Engineer** | `se`, `sf`, `swe`, `software engineer` |
| **Leadership** | `lead`, `leadership` |
| **Data** | `da`, `data` |

### `cv.json` Structure

To support this feature, the `work` entries in `cv.json` use a `categorized_highlights` object instead of a flat `highlights` array (though the legacy `highlights` array is still supported as a fallback/addition).

```json
"work": [
  {
    "name": "Company Name",
    "position": "Role",
    "categorized_highlights": {
      "DevOps": [
        "Kubernetes cluster management...",
        "CI/CD pipeline optimization..."
      ],
      "Software Engineer": [
        "Developed REST API in Go...",
        "React frontend implementation..."
      ]
    }
  }
]
```

- **No Role Selected:** All highlights are shown. In the portfolio view, they are tagged with their category (e.g., `[DevOps]`).
- **Role Selected:** Only highlights matching the role are shown. Tags are hidden for a cleaner look.

## 📱 Sections

1. **Hero** - Introduction with animated background
2. **About** - Professional summary
3. **Experience** - Work history (filterable)
4. **Skills** - Technical expertise
5. **Education** - Academic background
6. **Services** - Professional services offered
7. **Contact** - Contact information

## 👨‍💻 About Me

Software Engineer with professional experience since 2017 across full-stack development, application security, and cloud infrastructure. Master of Information Technology (Cybersecurity), CQUniversity, Australia (2025). Currently a Software Developer at PRX Vault, Brisbane, and a part-time Software Engineer at Let's Lyric.

### Connect With Me

- 🌐 Portfolio: [romerolweb.github.io](https://romerolweb.github.io/)
- 💼 LinkedIn: [sebastian-romerol](https://www.linkedin.com/in/sebastian-romerol/)
- 🐙 GitHub: [Romerolweb](https://github.com/Romerolweb)
- 🏆 Torre: [Romerolweb](https://torre.co/Romerolweb)

## 📄 License

[MIT](LICENSE). Use it, change it, ship it. Replace my data with yours before you publish.

## 🙏 Credit (optional)

Attribution is not required by the licence. If you want to leave a trace, a line like this in your README is plenty:

```markdown
Built from [Romerolweb/Romerolweb.github.io](https://github.com/Romerolweb/Romerolweb.github.io) (MIT).
```
