export function updatePageTitle(duration, issue, project) {
    if (duration) {
        issue = issue || '(No name)';
        project = project || '(Without project)';
        document.title = `${duration} ${issue} • ${project}`;
        document.getElementById('favicon').href = '/favicon-active.png';
    } else {
        document.title = `Wobbly - time tracker for teams`;
        document.getElementById('favicon').href = '/favicon.png';
    }
}
