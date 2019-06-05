import { getTimestamp } from './timeService';

export function addProjectPreProcessing(inputValue, color) {
    let ok = true;
    const projectName = inputValue.trim();
    if (!projectName.length) {
        ok = false;
        alert(`Project name can't be empty`);
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
