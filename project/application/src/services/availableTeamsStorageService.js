export function getAvailableTeamsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('teams')) || [];
}

export function setAvailableTeamsToLocalStorage(data) {
    localStorage.setItem('teams', JSON.stringify(data));
}

export function removeAvailableTeamsFromLocalStorage() {
    localStorage.removeItem('teams');
}
