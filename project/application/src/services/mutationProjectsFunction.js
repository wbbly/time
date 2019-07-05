import { getTimestamp } from './timeService';

export function addProjectPreProcessing(inputValue, color, vocabulary) {
    const { v_a_project_name_error } = vocabulary;
    let ok = true;
    const projectName = inputValue.trim();
    if (!projectName.length) {
        ok = false;
        alert(v_a_project_name_error);
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
