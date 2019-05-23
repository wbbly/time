export function getAvailableTeamsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('availableTeams')) || [];
}

export function setAvailableTeamsToLocalStorage(data) {
    localStorage.setItem('availableTeams', JSON.stringify(data));
}

export function removeAvailableTeamsFromLocalStorage() {
    localStorage.removeItem('availableTeams');
}
