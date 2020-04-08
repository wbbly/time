import { getDateTimestamp } from './services/timeService';
import { decodeTimeEntryIssue } from './services/timeEntryService';
import moment from 'moment';

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

        const { id, name, timer, client } = project;

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
            client,
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

export function getTimerPlanningListParseFunction(users) {
    let logged = [];
    let timer_plannings = [];

    users.forEach((user, i) =>
        user.timer_plannings.forEach((timer_planning, y) => {

            let matchedLogIndex = timer_plannings.findIndex(l => l.project_id === timer_planning.project_id);

            if (matchedLogIndex !== -1) {
                if (!timer_planning.timer_off && !timer_planning.timer_off_id && timer_planning.project) {
                    timer_plannings[matchedLogIndex].projects.push({
                        id: timer_planning.id,
                        project_id: timer_planning.project_id,
                        start_date: timer_planning.start_date,
                        end_date: timer_planning.end_date,
                        name: timer_planning.project
                            ? timer_planning.project.name
                            : timer_planning.timer_off
                                ? timer_planning.timer_off.title
                                : 'day off',
                        project_color: timer_planning.project ? timer_planning.project.project_color : { name: '#C42750' },
                        duration: timer_planning.duration,
                    });
                }

                if (!timer_planning.project) {
                    timer_plannings.forEach((item, index) => {
                        timer_plannings[index].timeOff.push({
                            id: timer_planning.id,
                            timer_off_id: timer_planning.timer_off_id,
                            start_date: timer_planning.start_date,
                            end_date: timer_planning.end_date,
                            title: timer_planning.timer_off ? timer_planning.timer_off.title : 'day off',
                            time_off_color: '#C42750',
                            duration: timer_planning.duration,
                        });
                    });
                }
            } else {
                timer_plannings.push({
                    id: timer_planning.id,
                    team_id: timer_planning.team_id,
                    project_id: timer_planning.project_id,
                    project: timer_planning.project,
                    timer_off_id: timer_planning.timer_off_id,
                    timer_off: timer_planning.timer_off,
                    duration: timer_planning.duration,
                    start_date: timer_planning.start_date,
                    end_date: timer_planning.end_date,
                    created_by_id: timer_planning.created_by_id,
                    created_by: timer_planning.created_by,
                    created_at: timer_planning.created_at,
                    projects: timer_planning.project
                        ? [
                              {
                                  id: timer_planning.id,
                                  project_id: timer_planning.project_id,
                                  start_date: timer_planning.start_date,
                                  end_date: timer_planning.end_date,
                                  name: timer_planning.project
                                      ? timer_planning.project.name
                                      : timer_planning.timer_off
                                          ? timer_planning.timer_off.title
                                          : 'day off',
                                  project_color: timer_planning.project
                                      ? timer_planning.project.project_color
                                      : { name: '#C42750' },
                                  duration: timer_planning.duration,
                              },
                          ]
                        : [],
                    timeOff: timer_planning.timer_off
                        ? [
                              {
                                  id: timer_planning.id,
                                  timer_off_id: timer_planning.timer_off_id,
                                  start_date: timer_planning.start_date,
                                  end_date: timer_planning.end_date,
                                  title: timer_planning.timer_off ? timer_planning.timer_off.title : 'day off',
                                  time_off_color: '#C42750',
                                  duration: timer_planning.duration,
                              },
                          ]
                        : [],
                });
            }
            if (users[i].timer_plannings.length - 1 === y) {
                users[i].timer_plannings = timer_plannings;
                timer_plannings = [];
            }
        })
    );
    //modify logged array by projectId
    users.forEach((user, i) =>
        user.logged.forEach((log, y) => {
            let matchedLogIndex = logged.findIndex(l => l.projectId === log.project_id);
            if (matchedLogIndex !== -1) {
                logged[matchedLogIndex].timeEntries.push({
                    startDatetime: log.start_datetime,
                    endDatetime: log.end_datetime,
                });
            } else {
                logged.push({
                    projectId: log.project_id,
                    issue: log.issue,
                    project: log.project,
                    timeEntries: [
                        {
                            startDatetime: log.start_datetime,
                            endDatetime: log.end_datetime,
                        },
                    ],
                });
            }
            if (users[i].logged.length - 1 === y) {
                users[i].logged = logged;
                logged = [];
            }
        })
    );

    users.forEach((user, i) =>
        user.logged.forEach((log, y) => {
            //add formattedDate and projectId keys
            let timeEntries = [];
            log.timeEntries.forEach(entry => {
                let findIndex = timeEntries.findIndex(
                    e => e.formattedDate === moment(entry.startDatetime).format('YYYY-MM-DD')
                );
                if (findIndex !== -1) {
                    timeEntries[findIndex].entries.push(entry);
                } else {
                    timeEntries.push({
                        formattedDate: moment(entry.startDatetime).format('YYYY-MM-DD'),
                        projectId: users[i].logged[y].projectId,
                        entries: [entry],
                    });
                }
            });

            //count total time
            timeEntries.forEach((entry, i) => {
                let totalTime = 0;
                entry.entries.forEach(e => {
                    totalTime += +moment(e.endDatetime) - +moment(e.startDatetime);
                });
                timeEntries[i].totalTime = +moment(totalTime).format('H');
            });

            //create groups of inextricable days
            let timeGroups = [];
            timeEntries.forEach((entry, i) => {
                if (i === 0) {
                    return timeGroups.push({
                        ...entry,
                        days: [entry],
                    });
                }
                const dateDiff = moment(entry.formattedDate).diff(moment(timeEntries[i - 1].formattedDate), 'days');

                if (dateDiff === 1) {
                    timeGroups[timeGroups.length - 1].totalTime += entry.totalTime;
                    timeGroups[timeGroups.length - 1].days.push(entry);
                } else {
                    timeGroups.push({
                        ...entry,
                        days: [entry],
                    });
                }
            });

            users[i].logged[y] = {
                timeGroups,
                ...users[i].logged[y].project,
                projectId: users[i].logged[y].projectId,
            };
        })
    );

    console.log({ users });
    return users;
}
