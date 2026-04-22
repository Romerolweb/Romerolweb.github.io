const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(dateStr) {
    if (!dateStr || dateStr === 'Present') return dateStr || 'Present';
    const [year, month] = dateStr.split('-');
    return month ? `${MONTHS[parseInt(month, 10) - 1]} ${year}` : year;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('../cv.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            populateCV(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.body.innerHTML = `<div style="text-align: center; padding: 50px;"><h1>Error</h1><p>Could not load CV data. Please check the console for details.</p><p>${error}</p></div>`;
        });
});

function populateCV(data) {
    const targetRole = getRoleFromUrl();

    // Basics
    const basics = data.basics;
    document.getElementById('name').textContent = basics.name;
    document.getElementById('label').textContent = basics.label;
    document.getElementById('summary-content').textContent = basics.summary;

    // Contact - using <address> for semantic correctness
    const contactContainer = document.getElementById('contact');
    const activeProfiles = basics.profiles.filter(p => p.url);
    activeProfiles.forEach(profile => {
        const profileLink = document.createElement('a');
        profileLink.href = profile.url;
        profileLink.target = '_blank';
        profileLink.rel = 'noopener noreferrer';
        profileLink.classList.add('profile-item');

        const icon = document.createElement('i');
        icon.className = profile.icon;
        icon.setAttribute('aria-hidden', 'true');
        profileLink.appendChild(icon);

        const label = profile.network === 'E-mail' && basics.email
            ? basics.email
            : profile.username;
        profileLink.append(label);
        contactContainer.appendChild(profileLink);
    });

    // Work Experience - using <article> per job for semantic structure
    const workContainer = document.getElementById('work-container');
    data.work.forEach(job => {
        const jobArticle = document.createElement('article');
        jobArticle.classList.add('job');

        let displayHighlights = [];

        if (job.categorized_highlights) {
            if (targetRole) {
                Object.keys(job.categorized_highlights).forEach(category => {
                    if (category.toLowerCase() === targetRole.toLowerCase()) {
                        displayHighlights = displayHighlights.concat(job.categorized_highlights[category]);
                    }
                });
            } else {
                Object.values(job.categorized_highlights).forEach(highlights => {
                    displayHighlights = displayHighlights.concat(highlights);
                });
            }
        }

        if (job.highlights) {
            displayHighlights = displayHighlights.concat(job.highlights);
        }

        // Skip entries with no relevant highlights when a role filter is active
        if (targetRole && displayHighlights.length === 0) return;

        jobArticle.innerHTML = `
            <header class="job-header">
                <h3 class="job-title">${job.position}</h3>
                <time class="job-date">${formatDate(job.startDate)} – ${job.endDate ? formatDate(job.endDate) : 'Present'}</time>
            </header>
            <p class="job-company">
                ${job.url ? `<a href="${job.url}" target="_blank" rel="noopener noreferrer">${job.name}</a>` : job.name}${job.location ? ` - ${job.location}` : ''}
            </p>
            ${job.summary ? `<p class="job-summary">${job.summary}</p>` : ''}
            ${displayHighlights.length > 0 ? `
            <ul>
                ${displayHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>` : ''}
        `;
        workContainer.appendChild(jobArticle);
    });

    // Education
    const educationContainer = document.getElementById('education-container');
    data.education.forEach(edu => {
        const eduArticle = document.createElement('article');
        eduArticle.classList.add('education-item');

        eduArticle.innerHTML = `
            <header class="education-header">
                <h3 class="education-study-type">${edu.studyType} - ${edu.area}</h3>
                <time class="education-date">${formatDate(edu.startDate)} – ${edu.endDate ? formatDate(edu.endDate) : 'Present'}</time>
            </header>
            <p class="education-institution">
                ${edu.url ? `<a href="${edu.url}" target="_blank" rel="noopener noreferrer">${edu.institution}</a>` : edu.institution}
            </p>
            ${edu.courses ? `<ul>${edu.courses.map(course => `<li>${course}</li>`).join('')}</ul>` : ''}
        `;
        educationContainer.appendChild(eduArticle);
    });

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    data.skills.forEach(skillCategory => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('skill-category');

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = skillCategory.name + ': ';
        categoryDiv.appendChild(categoryTitle);

        const keywordsDiv = document.createElement('p');
        keywordsDiv.classList.add('keywords');
        keywordsDiv.textContent = skillCategory.keywords.join(', ');
        categoryDiv.appendChild(keywordsDiv);

        skillsContainer.appendChild(categoryDiv);
    });

    // Languages
    const languagesContainer = document.getElementById('languages-container');
    data.languages.forEach(lang => {
        const langDiv = document.createElement('dl');
        langDiv.classList.add('language-item');
        langDiv.innerHTML = `<dt>${lang.language}</dt><dd>${lang.fluency}</dd>`;
        languagesContainer.appendChild(langDiv);
    });

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    data.projects.forEach(project => {
        const projectArticle = document.createElement('article');
        projectArticle.classList.add('project');
        projectArticle.innerHTML = `
            <header class="project-header">
                <h3 class="project-name">${project.name}</h3>
            </header>
            ${project.url ? `<p class="project-url"><a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.url}</a></p>` : ''}
            <p class="project-description">${project.description}</p>
            ${project.highlights && project.highlights.length > 0 ? `
            <ul>
                ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>` : ''}
        `;
        projectsContainer.appendChild(projectArticle);
    });

    // Publications
    const publicationsContainer = document.getElementById('publications-container');
    if (data.publications && data.publications.length > 0) {
        data.publications.forEach(pub => {
            const pubArticle = document.createElement('article');
            pubArticle.classList.add('publication');
            pubArticle.innerHTML = `
                <header class="publication-header">
                    <h3 class="publication-name">${pub.name}</h3>
                    <time class="publication-date">${pub.releaseDate}</time>
                </header>
                <p class="publication-publisher">${pub.publisher}</p>
                ${pub.website ? `<p class="publication-website"><a href="${pub.website}" target="_blank" rel="noopener noreferrer">${pub.website}</a></p>` : ''}
                <p class="publication-summary">${pub.summary}</p>
            `;
            publicationsContainer.appendChild(pubArticle);
        });
    } else {
        document.getElementById('publications').hidden = true;
    }

    // Awards
    const awardsContainer = document.getElementById('awards-container');
    if (data.awards && data.awards.length > 0) {
        data.awards.forEach(award => {
            const awardArticle = document.createElement('article');
            awardArticle.classList.add('award');
            awardArticle.innerHTML = `
                <header class="award-header">
                    <h3 class="award-title">${award.title}</h3>
                    <time class="award-date">${award.date}</time>
                </header>
                <p class="awarder">${award.awarder}</p>
                <p class="award-summary">${award.summary}</p>
            `;
            awardsContainer.appendChild(awardArticle);
        });
    } else {
        document.getElementById('awards').hidden = true;
    }

    // Certificates
    const certificatesContainer = document.getElementById('certificates-container');
    if (data.certificates && data.certificates.length > 0) {
        data.certificates.forEach(cert => {
            const certArticle = document.createElement('article');
            certArticle.classList.add('certificate');
            certArticle.innerHTML = `
                <header class="certificate-header">
                    <h3 class="certificate-name">${cert.name} - <strong>${cert.issuer}</strong></h3>
                    <time class="certificate-date">${cert.date}</time>
                </header>
            `;
            certificatesContainer.appendChild(certArticle);
        });
    } else {
        document.getElementById('certificates').hidden = true;
    }
}
