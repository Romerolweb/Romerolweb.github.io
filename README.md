# Sebastian Romero Laguna - Professional Resume

[![Live Site](https://img.shields.io/badge/Live-Site-purple)](https://romerolweb.github.io/)
[![Built with HTML/JS](https://img.shields.io/badge/Built%20with-HTML%2FJS-yellow)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC)](https://tailwindcss.com/)

Modern, responsive resume/portfolio website built with vanilla HTML, JavaScript, and **Tailwind CSS**.

## 🚀 Features

- **Modern Stack**: Built with vanilla HTML/JS and Tailwind CSS v3
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Data Driven**: All content is loaded dynamically from `cv.json`
- **Role-Based CV**: Dynamically filter resume content based on target role
- **Interactive Components**: Dynamic navigation, hero animation
- **Professional Sections**: About, Experience, Skills, Education, Services, Contact

## 🛠️ Technologies Used

- **Tailwind CSS v3** - Utility-first CSS framework (via CDN)
- **Font Awesome 6** - Icon library (via CDN)
- **Day.js** - Date formatting
- **Vanilla JavaScript** - Core logic

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

Software Engineer with 6+ years of experience in full-stack development, cloud architecture (AWS, Azure), and AI/ML technologies. Currently pursuing Master's in Information Technology at CQUniversity, Australia.

### Connect With Me

- 🌐 Portfolio: [romerolweb.github.io](https://romerolweb.github.io/)
- 💼 LinkedIn: [sebastian-romerol](https://www.linkedin.com/in/sebastian-romerol/)
- 🐙 GitHub: [Romerolweb](https://github.com/Romerolweb)
- 🏆 Torre: [Romerolweb](https://torre.co/Romerolweb)
- 📧 Email: sebastianromerol@outlook.es

## 📄 License

© 2025 Sebastian Romero Laguna. All Rights Reserved.
