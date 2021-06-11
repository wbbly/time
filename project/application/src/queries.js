import { getDateTimestamp } from './services/timeService';
import { decodeTimeEntryIssue } from './services/timeEntryService';

export function getProjectListParseFunction(array) {
    return array.map(project => {
        const { is_active: isActive, project_color: projectColor, user_projects: userProjects, ...rest } = project;
        let { timer } = project;
        if (timer) {
            timer = timer.map(item => {
                const { start_datetime: startDatetime, end_datetime: endDatetime } = item;
                return {
                    startDatetime,
                    endDatetime,
                };
            });

            return {
                ...rest,
                isActive,
                projectColor,
                timer,
                userProjects: userProjects ? userProjects.map(item => item.user) : [],
            };
        } else {
            return {
                ...rest,
                isActive,
                projectColor,
                userProjects: userProjects ? userProjects.map(item => item.user) : [],
            };
        }
    });
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

export function addUserRoleToProjects(data) {
    return data.map(item => {
        const { userProjects } = item;
        if (!!userProjects.length) {
            userProjects.forEach(user => {
                user.role = user.user_teams[0].role_collaboration.title;
            });
        }
        return { ...item, userProjects };
    });
}

export function getTodayTimeEntriesParseFunction(data) {
    const dataParsed = {
        timerV2: [],
    };
    const { timer_v2 } = data;
    for (let i = 0; i < timer_v2.length; i++) {
        const item = timer_v2[i];
        const {
            id,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            issue,
            project,
            sync_jira_status: syncJiraStatus,
        } = item;
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
            syncJiraStatus,
        });
    }

    return dataParsed;
}
