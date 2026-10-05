// Shared by index.html (site.js) and views/cv.html (cv.js).
const roleAliases = {
    'do': 'DevOps',
    'devops': 'DevOps',
    'sf': 'Software Engineer',
    'se': 'Software Engineer',
    'swe': 'Software Engineer',
    'software engineer': 'Software Engineer',
    'leadership': 'Leadership',
    'lead': 'Leadership',
    'data': 'Data',
    'da': 'Data'
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Present';
    const [year, month] = dateStr.split('-');
    return month ? `${MONTHS[parseInt(month, 10) - 1]} ${year}` : year;
}

function formatRange(start, end) {
    return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`;
}

function getRoleFromUrl() {
    const role = new URLSearchParams(globalThis.location.search).get('role');
    if (!role) return null;
    return roleAliases[role.toLowerCase()] || role;
}

function updateUrlRole(role, callback) {
    const url = new URL(globalThis.location);
    if (role) {
        url.searchParams.set('role', role);
    } else {
        url.searchParams.delete('role');
    }
    globalThis.history.pushState({}, '', url);
    if (callback) callback();
}

function collectRoles(work) {
    const roles = new Set();
    work.forEach(job => Object.keys(job.categorized_highlights || {}).forEach(r => roles.add(r)));
    return Array.from(roles);
}

// Returns [{ text, tag }] for a job. tag is null when a role filter is active.
function highlightsFor(job, targetRole) {
    const items = [];
    Object.entries(job.categorized_highlights || {}).forEach(([category, list]) => {
        if (targetRole && category.toLowerCase() !== targetRole.toLowerCase()) return;
        list.forEach(text => items.push({ text, tag: targetRole ? null : category }));
    });
    (job.highlights || []).forEach(text => items.push({ text, tag: null }));
    return items;
}

function renderRoleChips(container, roles, currentRole, onSelect) {
    const chip = (label, role, pressed) =>
        `<button type="button" class="chip" aria-pressed="${pressed}" data-role="${role || ''}">${label}</button>`;
    container.innerHTML = chip('All', null, !currentRole) + roles.map(role =>
        chip(role, role, Boolean(currentRole && currentRole.toLowerCase() === role.toLowerCase()))
    ).join('');
    container.querySelectorAll('.chip').forEach(button => {
        button.addEventListener('click', () => updateUrlRole(button.dataset.role || null, onSelect));
    });
}
