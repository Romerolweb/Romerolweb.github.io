# Sebastian Romero Laguna - Professional Resume

[![Live Site](https://img.shields.io/badge/Live-Site-purple)](https://romerolweb.github.io/)
[![Built with HTML/JS](https://img.shields.io/badge/Built%20with-HTML%2FJS-yellow)](https://developer.mozilla.org/en-US/docs/Web/HTML)

Responsive resume/portfolio website built with vanilla HTML, CSS, and JavaScript. No build step.

## 🚀 Features

- **No dependencies**: Vanilla HTML/CSS/JS with a small token-based design system (`assets/css/tokens.css`)
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Data Driven**: All content is loaded dynamically from `cv.json`
- **Role-Based CV**: Dynamically filter resume content based on target role
- **Interactive Components**: Dynamic navigation, hero animation
- **ATS-friendly CV**: `views/cv.html` renders a single-column, icon-free, printable CV for applicant tracking systems and OCR
- **Professional Sections**: About, Experience, Skills, Education, Services, Contact

## 🛠️ Technologies Used

- **Vanilla HTML/CSS/JavaScript** - no framework, no build step
- **Font Awesome 6** - social icons on the portfolio page only (via CDN)
- **Design tokens** - colours, type scale, spacing, radii and shadows live in `assets/css/tokens.css` and are consumed by `assets/css/site.css` (portfolio) and `assets/css/cv.css` (printable CV)

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

© 2026 Sebastian Romero Laguna. All Rights Reserved.
