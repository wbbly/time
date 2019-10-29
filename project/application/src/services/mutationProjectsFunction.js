import { getTimestamp } from './timeService';

export function addProjectPreProcessing(inputValue, color, vocabulary, showNotificationAction) {
    const { v_a_project_name_error } = vocabulary;
    let ok = true;
    const projectName = inputValue.trim();
    if (!projectName.length) {
        ok = false;
        showNotificationAction({ text: v_a_project_name_error, type: 'warning' });
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
