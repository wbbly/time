export function getServerClientTimediffFromLocalStorage() {
    const serverClientTimediff = localStorage.getItem('server-client-timediff');

    return serverClientTimediff ? +serverClientTimediff : 0;
}

export function setServerClientTimediffToLocalStorage(value) {
    localStorage.setItem('server-client-timediff', value);
}

export function removeServerClientTimediffFromLocalStorage() {
    localStorage.removeItem('server-client-timediff');
}
