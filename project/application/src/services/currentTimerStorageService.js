export function getCurrentTimerFromLocalStorage() {
    return JSON.parse(localStorage.getItem('current-timer')) || {};
}

export function setCurrentTimerToLocalStorage(currentTimer) {
    localStorage.setItem('current-timer', JSON.stringify(currentTimer));
}

export function removeCurrentTimerFromLocalStorage() {
    localStorage.removeItem('current-timer');
}
