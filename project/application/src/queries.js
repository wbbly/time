import { getDateTimestamp } from './services/timeService';
import { decodeTimeEntryIssue } from './services/timeEntryService';

export function getProjectListParseFunction(result) {
    const dataParsed = {
        projectV2: [],
    };
    const { project_v2 } = result.data;
    for (let i = 0; i < project_v2.length; i++) {
        const item = project_v2[i];
        const { id, is_active: isActive, name, project_color: projectColor } = item;
        dataParsed.projectV2.push({
            id,
            isActive,
            name,
            projectColor,
        });
    }

    return dataParsed;
}

export function getProjectsV2ProjectPageAdminParseFunction(data) {
    const dataParsed = {
        projectV2: [],
    };
    const { project_v2: projectV2 } = data;
    for (let i = 0; i < projectV2.length; i++) {
        const project = projectV2[i];

        const { id, name, timer } = project;

        let totalTime = 0; // in ms
        for (let i = 0; i < timer.length; i++) {
            const timeEntry = timer[i];
            const { start_datetime: startDatetime, end_datetime: endDatetime } = timeEntry;
            totalTime += getDateTimestamp(endDatetime) - getDateTimestamp(startDatetime);
        }

        dataParsed.projectV2.push({
            id,
            name,
            totalTime,
        });
    }

    return dataParsed;
}

export function getProjectsV2ProjectPageUserParseFunction(data) {
    const dataParsed = {
        projectV2: [],
    };
    const { project_v2: projectV2 } = data;
    for (let i = 0; i < projectV2.length; i++) {
        const project = projectV2[i];

        const { id, name, timer } = project;

        let totalTime = 0; // in ms
        for (let i = 0; i < timer.length; i++) {
            const timeEntry = timer[i];
            const { start_datetime: startDatetime, end_datetime: endDatetime } = timeEntry;
            totalTime += getDateTimestamp(endDatetime) - getDateTimestamp(startDatetime);
        }

        dataParsed.projectV2.push({
            id,
            name,
            totalTime,
        });
    }

    return dataParsed;
}

export function getTodayTimeEntriesParseFunction(data) {
    const dataParsed = {
        timerV2: [],
    };
    const { timer_v2 } = data;
    for (let i = 0; i < timer_v2.length; i++) {
        const item = timer_v2[i];
        const { id, start_datetime: startDatetime, end_datetime: endDatetime, issue, project } = item;
        const { name: projectName, id: projectId, project_color: projectColor } = project;
        const { name: projectColorName } = projectColor;
        dataParsed.timerV2.push({
            id,
            startDatetime,
            endDatetime,
            issue: decodeTimeEntryIssue(issue),
            project: {
                name: projectName,
                id: projectId,
                projectColor: {
                    name: projectColorName,
                },
            },
        });
    }

    return dataParsed;
}
