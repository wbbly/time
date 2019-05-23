export function getCurrentTeamDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('currentTeamData')) || {};
}

export function setCurrentTeamDataToLocalStorage(data) {
    localStorage.setItem('currentTeamData', JSON.stringify(data));
}

export function removeCurrentTeamDataFromLocalStorage() {
    localStorage.removeItem('currentTeamData');
}
