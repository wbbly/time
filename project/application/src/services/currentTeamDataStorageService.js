export function getCurrentTeamDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('current-team')) || {};
}

export function setCurrentTeamDataToLocalStorage(data) {
    localStorage.setItem('current-team', JSON.stringify(data));
}

export function removeCurrentTeamDataFromLocalStorage() {
    localStorage.removeItem('current-team');
}
