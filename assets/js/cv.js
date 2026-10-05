document.addEventListener('DOMContentLoaded', () => {
    fetch('../cv.json')
        .then(response => {
            if (!response.ok) throw new Error(`Could not load cv.json (${response.status})`);
            return response.json();
        })
        .then(data => populateCV(data))
        .catch(error => {
            console.error(error);
            document.body.innerHTML = `<main class="cv"><h1>Error</h1><p>Could not load CV data. ${error.message}</p></main>`;
        });
});

const byId = id => document.getElementById(id);

function fill(id, items, render) {
    const section = byId(id);
    const container = byId(`${id}-container`);
    if (!items || items.length === 0) {
        section.hidden = true;
        return;
    }
    section.hidden = false;
    container.innerHTML = items.map(render).join('');
}

function link(url, text) {
    return url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
}

function displayUrl(url) {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function populateCV(data) {
    const targetRole = getRoleFromUrl();
    const basics = data.basics;

    document.title = `${basics.name} - CV`;
    byId('name').textContent = basics.name;
    byId('label').textContent = basics.label;
    byId('summary-content').textContent = basics.summary;

    const location = basics.location;
    const contact = [];
    if (location && location.city) {
        const country = new Intl.DisplayNames(['en'], { type: 'region' }).of(location.countryCode);
        contact.push(`${location.city}, ${location.region}, ${country}`);
    }
    if (basics.email) contact.push(`<a href="mailto:${basics.email}">${basics.email}</a>`);
    if (basics.phone) contact.push(basics.phone);
    basics.profiles.filter(p => p.url).forEach(p => contact.push(link(p.url, displayUrl(p.url))));
    byId('contact').innerHTML = contact.join('<span class="sep"> · </span>');

    renderRoleChips(byId('role-filters'), collectRoles(data.work), targetRole, () => populateCV(data));
    syncRoleLinks();

    const jobs = data.work
        .map(job => ({ job, items: highlightsFor(job, targetRole) }))
        .filter(({ items }) => !targetRole || items.length > 0);

    fill('work', jobs, ({ job, items }) => `
        <article class="entry">
            <header>
                <h3>${job.position}</h3>
                <time>${formatRange(job.startDate, job.endDate)}</time>
            </header>
            <p class="org">${link(job.url, job.name)}${job.location ? `, ${job.location}` : ''}</p>
            ${job.summary ? `<p class="lede">${job.summary}</p>` : ''}
            ${items.length ? `<ul>${items.map(i => `<li>${i.text}</li>`).join('')}</ul>` : ''}
        </article>`);

    fill('skills', data.skills, group => `
        <p class="skill-line"><strong>${group.name}:</strong> ${group.keywords.join(', ')}</p>`);

    fill('education', data.education, edu => `
        <article class="entry">
            <header>
                <h3>${edu.studyType}, ${edu.area}</h3>
                <time>${formatRange(edu.startDate, edu.endDate)}</time>
            </header>
            <p class="org">${link(edu.url, edu.institution)}${edu.location ? `, ${edu.location}` : ''}${edu.score ? ` · ${edu.score}` : ''}</p>
            ${edu.courses ? `<ul>${edu.courses.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
        </article>`);

    fill('projects', data.projects, project => `
        <article class="entry">
            <header>
                <h3>${project.name}</h3>
                ${project.keywords ? `<span class="keywords">${project.keywords.join(', ')}</span>` : ''}
            </header>
            <p class="lede">${project.description}${project.url ? ` ${link(project.url, displayUrl(project.url))}` : ''}</p>
            ${project.highlights && project.highlights.length ? `<ul>${project.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
        </article>`);

    fill('publications', data.publications, pub => `
        <article class="entry">
            <header>
                <h3>${pub.name}</h3>
                <time>${formatDate(pub.releaseDate)}</time>
            </header>
            <p class="org">${pub.publisher}${pub.url ? ` · ${link(pub.url, displayUrl(pub.url))}` : ''}</p>
            <p class="lede">${pub.summary}</p>
        </article>`);

    fill('awards', data.awards, award => `
        <article class="entry">
            <header>
                <h3>${award.title}</h3>
                <time>${formatDate(award.date)}</time>
            </header>
            <p class="org">${award.awarder}</p>
            <p class="lede">${award.summary}</p>
        </article>`);

    fill('certificates', data.certificates, cert => `
        <li>${cert.name}${cert.issuer ? `, ${cert.issuer}` : ''}${cert.date ? ` (${formatDate(cert.date)})` : ''}</li>`);

    fill('languages', data.languages, lang => `
        <li><strong>${lang.language}:</strong> ${lang.fluency}</li>`);
}
