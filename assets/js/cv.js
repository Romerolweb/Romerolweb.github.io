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

    const contactContainer = document.getElementById('contact');
    basics.profiles.forEach(profile => {
        const profileLink = document.createElement('a');
        profileLink.href = profile.url;
        profileLink.target = '_blank';
        profileLink.classList.add('profile-item');

        const icon = document.createElement('i');
        icon.className = profile.icon;
        profileLink.appendChild(icon);
        
        profileLink.append(profile.network === 'E-mail' ? basics.email : profile.username);
        contactContainer.appendChild(profileLink);
    });

    // Work Experience
    const workContainer = document.getElementById('work-container');
    data.work.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('job');

        // Logic to gather highlights based on role
        let displayHighlights = [];

        if (job.categorized_highlights) {
            if (targetRole) {
                // Filter by role (case-insensitive key match)
                Object.keys(job.categorized_highlights).forEach(category => {
                    if (category.toLowerCase() === targetRole.toLowerCase()) {
                        displayHighlights = displayHighlights.concat(job.categorized_highlights[category]);
                    }
                });
            } else {
                // No role specified: show all, flattened
                Object.values(job.categorized_highlights).forEach(highlights => {
                    displayHighlights = displayHighlights.concat(highlights);
                });
            }
        }

        // Fallback or addition of legacy highlights
        if (job.highlights) {
             displayHighlights = displayHighlights.concat(job.highlights);
        }

        jobDiv.innerHTML = `
            <div class="job-header">
                <span class="job-title">${job.position}</span>
                <span class="job-date">${job.startDate} - ${job.endDate || 'Present'}</span>
            </div>
            <div class="job-company">
                ${job.url ? `<a href="${job.url}" target="_blank">${job.name}</a>` : job.name} - ${job.location}
            </div>
            ${job.summary ? `<p class="job-summary">${job.summary}</p>` : ''}
            <ul>
                ${displayHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        `;
        workContainer.appendChild(jobDiv);
    });

    // Education
    const educationContainer = document.getElementById('education-container');
    data.education.forEach(edu => {
        const eduDiv = document.createElement('div');
        eduDiv.classList.add('education-item');

        eduDiv.innerHTML = `
            <div class="education-header">
                <span class="education-study-type">${edu.studyType} - ${edu.area}</span>
                 <span class="education-date">${edu.startDate} - ${edu.endDate || 'Present'}</span>
            </div>
            <div class="education-institution">
                 ${edu.url ? `<a href="${edu.url}" target="_blank">${edu.institution}</a>` : edu.institution}
            </div>
            ${edu.courses ? `<ul>${edu.courses.map(course => `<li>${course}</li>`).join('')}</ul>` : ''}
        `;
        educationContainer.appendChild(eduDiv);
    });

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    data.skills.forEach(skillCategory => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('skill-category');
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = skillCategory.name + ': ';
        categoryDiv.appendChild(categoryTitle);

        const keywordsDiv = document.createElement('div');
        keywordsDiv.classList.add('keywords');
        keywordsDiv.textContent = skillCategory.keywords.join(', ');
        categoryDiv.appendChild(keywordsDiv);
        
        skillsContainer.appendChild(categoryDiv);
    });

    // Languages
    const languagesContainer = document.getElementById('languages-container');
    data.languages.forEach(lang => {
        const langDiv = document.createElement('div');
        langDiv.classList.add('language-item');
        langDiv.innerHTML = `<strong>${lang.language}:</strong> <span>${lang.fluency}</span>`;
        languagesContainer.appendChild(langDiv);
    });

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    data.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.innerHTML = `
            <div class="project-header">
                <span class="project-name">${project.name}</span>
            </div>
            ${project.url ? `<div class="project-url"><a href="${project.url}" target="_blank">${project.url}</a></div>` : ''}
            <p class="project-description">${project.description}</p>
            <ul>
                ${project.highlights ? project.highlights.map(highlight => `<li>${highlight}</li>`).join('') : ''}
            </ul>
        `;
        projectsContainer.appendChild(projectDiv);
    });
    
    // Publications
    const publicationsContainer = document.getElementById('publications-container');
    if (data.publications && data.publications.length > 0) {
        data.publications.forEach(pub => {
            const pubDiv = document.createElement('div');
            pubDiv.classList.add('publication');
            pubDiv.innerHTML = `
                <div class="publication-header">
                    <span class="publication-name">${pub.name}</span>
                    <span class="publication-date">${pub.releaseDate}</span>
                </div>
                <div class="publication-publisher">${pub.publisher}</div>
                ${pub.website ? `<div class="publication-website"><a href="${pub.website}" target="_blank">${pub.website}</a></div>` : ''}
                <p class="publication-summary">${pub.summary}</p>
            `;
            publicationsContainer.appendChild(pubDiv);
        });
    } else {
        document.getElementById('publications').style.display = 'none';
    }


    // Awards
    const awardsContainer = document.getElementById('awards-container');
    if (data.awards && data.awards.length > 0) {
        data.awards.forEach(award => {
            const awardDiv = document.createElement('div');
            awardDiv.classList.add('award');
            awardDiv.innerHTML = `
                <div class="award-header">
                    <span class="award-title">${award.title}</span>
                    <span class="award-date">${award.date}</span>
                </div>
                <div class="awarder">${award.awarder}</div>
                <p class="award-summary">${award.summary}</p>
            `;
            awardsContainer.appendChild(awardDiv);
        });
     } else {
        document.getElementById('awards').style.display = 'none';
    }

    // Certificates
    const certificatesContainer = document.getElementById('certificates-container');
    if (data.certificates && data.certificates.length > 0) {
        data.certificates.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.classList.add('certificate');
            certDiv.innerHTML = `
                <div class="certificate-header">
                    <span class="certificate-name">${cert.name} - <strong>${cert.issuer}</strong></span>
                    <span class="certificate-date">${cert.date}</span>
                </div>
            `;
            certificatesContainer.appendChild(certDiv);
        });
    } else {
        document.getElementById('certificates').style.display = 'none';
    }
}
