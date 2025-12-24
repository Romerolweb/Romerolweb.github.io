// Shared utility for CV role management
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

function getRoleFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (!role) return null;
    return roleAliases[role.toLowerCase()] || role;
}

function updateUrlRole(role, callback) {
    const url = new URL(window.location);
    if (role) {
        url.searchParams.set('role', role);
    } else {
        url.searchParams.delete('role');
    }
    window.history.pushState({}, '', url);
    if (callback) callback();
}
