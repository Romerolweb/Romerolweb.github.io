const byId = id => document.getElementById(id);

/* Mobile navigation */
const navToggle = byId('nav-toggle');
const mobileNav = byId('mobile-nav');
const mobileClose = byId('mobile-nav-close');

function trapFocus(container) {
    return event => {
        if (event.key !== 'Tab') return;
        const focusable = Array.from(container.querySelectorAll('a, button'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };
}

const trapMobileNav = trapFocus(mobileNav);

function openMobileNav() {
    mobileNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileClose.focus();
    mobileNav.addEventListener('keydown', trapMobileNav);
}

function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
    mobileNav.removeEventListener('keydown', trapMobileNav);
}

navToggle.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

/* Services modal */
const modal = byId('modal');
const trapModal = trapFocus(modal);
let modalTrigger = null;

function openModal(service, trigger) {
    modalTrigger = trigger;
    byId('modalTitle').textContent = service.name;
    byId('modalContent').textContent = service.description;
    modal.classList.add('is-open');
    modal.querySelector('button').focus();
    modal.addEventListener('keydown', trapModal);
}

function closeModal() {
    modal.classList.remove('is-open');
    modal.removeEventListener('keydown', trapModal);
    if (modalTrigger) modalTrigger.focus();
    modalTrigger = null;
}

byId('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
});
document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) closeModal();
    if (mobileNav.classList.contains('is-open')) closeMobileNav();
});

/* CV data */
let cvData = null;

async function fetchCVData() {
    try {
        const response = await fetch('./cv.json');
        cvData = await response.json();
        renderCV();
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
}

function link(url, text) {
    return url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
}

function tags(keywords) {
    return keywords && keywords.length
        ? `<div class="tag-list">${keywords.map(k => `<span class="tag">${k}</span>`).join('')}</div>`
        : '';
}

function renderCV() {
    const data = cvData;
    if (!data) return;
    const { basics } = data;

    document.querySelector('.hero-name').textContent = basics.name;
    document.querySelector('.hero-label').textContent = basics.label;
    byId('about').querySelector('.about').innerHTML =
        basics.summary.split('\n').map(p => `<p>${p}</p>`).join('');
    renderSocialLinks(basics.profiles.filter(p => p.url));
    renderContact(basics);

    renderSkills(data.skills);
    renderExperience(data.work);
    renderProjects(data.projects);
    renderEducation(data.education);
    renderLanguages(data.languages);
    renderCertifications(data.certificates);
    renderServices(data.services);
}

function renderSocialLinks(profiles) {
    const html = profiles.map(p => `
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="${p.network}">
            <i class="${p.icon}" aria-hidden="true"></i>
        </a>`).join('');
    document.querySelectorAll('.social-links').forEach(el => { el.innerHTML = html; });
}

function renderContact(basics) {
    document.querySelector('.contact-card').innerHTML = `
        <p>I'm open to new opportunities and collaborations. Feel free to reach out.</p>
        ${basics.email ? `<a href="mailto:${basics.email}">${basics.email}</a>` : ''}
        ${basics.phone ? `<p>${basics.phone}</p>` : ''}`;
}

function renderSkills(skills) {
    byId('skills-grid').innerHTML = skills.map(group => `
        <div class="card skill-card">
            <h3>${group.name}</h3>
            ${tags(group.keywords)}
        </div>`).join('');
}

function renderExperience(work) {
    const targetRole = getRoleFromUrl();
    renderRoleChips(byId('role-filters'), collectRoles(work), targetRole, renderCV);

    byId('experience-list').innerHTML = work.map(job => {
        const items = highlightsFor(job, targetRole);
        if (targetRole && items.length === 0) return '';
        return `
            <article class="card entry">
                <h3>${job.position}</h3>
                <p class="org">${link(job.url, job.name)}</p>
                <p class="meta">${formatRange(job.startDate, job.endDate)}${job.location ? ` · ${job.location}` : ''}</p>
                ${job.summary ? `<p class="lede">${job.summary}</p>` : ''}
                ${items.length ? `<ul>${items.map(item => `
                    <li>${item.tag ? `<span class="tag-small">${item.tag}</span>` : ''}${item.text}</li>`).join('')}</ul>` : ''}
            </article>`;
    }).join('');
}

function renderProjects(projects) {
    byId('projects-grid').innerHTML = projects.map(project => `
        <article class="card project-card">
            <h3>${project.url ? link(project.url, project.name) : project.name}</h3>
            ${project.entity ? `<p class="meta">${project.entity}</p>` : ''}
            <p>${project.description}</p>
            ${tags(project.keywords)}
        </article>`).join('');
}

function renderEducation(education) {
    byId('education-list').innerHTML = education.map(edu => `
        <article class="card entry">
            <h3>${edu.studyType}, ${edu.area}</h3>
            <p class="org">${link(edu.url, edu.institution)}</p>
            <p class="meta">${formatRange(edu.startDate, edu.endDate)}${edu.score ? ` · ${edu.score}` : ''}</p>
            ${edu.courses ? `<ul>${edu.courses.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
        </article>`).join('');
}

function renderLanguages(languages) {
    byId('language-pills').innerHTML = languages.map(lang => `
        <div class="pill"><strong>${lang.language}</strong><span>${lang.fluency}</span></div>`).join('');
}

function renderCertifications(certificates) {
    byId('cert-grid').innerHTML = certificates.map(cert => `
        <div class="cert">
            <strong>${cert.name}</strong>
            <span>${[cert.issuer, formatDate(cert.date)].filter(Boolean).join(' · ')}</span>
        </div>`).join('');
}

function renderServices(services) {
    const grid = byId('services-grid');
    grid.innerHTML = services.map((service, index) => `
        <article class="card project-card card-link" role="button" tabindex="0" data-index="${index}">
            <h3>${service.name}</h3>
            ${tags(service.keywords)}
        </article>`).join('');
    grid.querySelectorAll('.card-link').forEach(card => {
        const open = () => openModal(services[card.dataset.index], card);
        card.addEventListener('click', open);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
    });
}

byId('current-year').textContent = new Date().getFullYear();
fetchCVData();
