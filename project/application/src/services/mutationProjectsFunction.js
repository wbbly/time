import { getTimestamp } from './timeService';

export function addProjectPreProcessing(inputValue, color) {
    let ok = true;
    const projectName = inputValue.toLowerCase().trim();
    if (!projectName.length) {
        ok = false;
        alert(`Project name can't be empty`);
    } else if (projectName !== inputValue) {
        const r = window.confirm(`Project name will be changed to "${projectName}". Are you agree?`);
        ok = r === true;
    }

    if (ok) {
        return {
            id: getTimestamp(),
            name: projectName,
            colorProject: color,
        };
    }

    return null;
}
