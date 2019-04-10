import { encodeTimeEntryIssue, decodeTimeEntryIssue } from './services/timeEntryService';

export const getProjectsV2 = {
    graphqlRequest: `{ project_v2(order_by: {name: desc}) {
            id
            name
            is_active
            project_color {
                name
            }
        }
    }`,
    parseFunction: data => {
        const dataParsed = {
            projectV2: [],
        };
        const { project_v2 } = data;
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
    },
};

export const getProjectsV2ProjectPageAdmin = {
    graphqlRequest: `{ project_v2 (order_by: {name: asc}, limit: 100) {
        id
        is_active
        name
        timer {
            start_datetime
            end_datetime
        }
    }
}`,
    parseFunction: data => {
        const dataParsed = {
            projectV2: [],
        };
        const { project_v2: projectV2 } = data;
        for (let i = 0; i < projectV2.length; i++) {
            const project = projectV2[i];

            const { id, is_active: isActive, name, timer } = project;

            let totalTime = 0; // in ms
            for (let i = 0; i < timer.length; i++) {
                const timeEntry = timer[i];
                const { start_datetime: startDatetime, end_datetime: endDatetime } = timeEntry;
                totalTime += +new Date(endDatetime) - +new Date(startDatetime);
            }

            dataParsed.projectV2.push({
                id,
                name,
                totalTime,
            });
        }

        return dataParsed;
    },
};

export function getProjectsV2ProjectPageUser(id) {
    return {
        graphqlRequest: `{ project_v2 (order_by: {name: asc})  {
        id
        is_active
        name
        timer (where: {user_id: {_eq: "${id}"}}) {
            start_datetime
            end_datetime
        }
    }
}`,
        parseFunction: data => {
            const dataParsed = {
                projectV2: [],
            };
            const { project_v2: projectV2 } = data;
            for (let i = 0; i < projectV2.length; i++) {
                const project = projectV2[i];

                const { id, is_active: isActive, name, timer } = project;

                let totalTime = 0; // in ms
                for (let i = 0; i < timer.length; i++) {
                    const timeEntry = timer[i];
                    const { start_datetime: startDatetime, end_datetime: endDatetime } = timeEntry;
                    totalTime += +new Date(endDatetime) - +new Date(startDatetime);
                }

                dataParsed.projectV2.push({
                    id,
                    name,
                    totalTime,
                });
            }

            return dataParsed;
        },
    };
}

export function getTodayTimeEntries(id) {
    return {
        graphqlRequest: `{ timer_v2 (where: {user_id: {_eq: "${id}"}},order_by: {created_at: desc}, limit: 50) {
            id,
            start_datetime,
            end_datetime,
            issue,
            project {
                name,
                id,
                project_color {
                name
                    }
                }
            }
        }`,
        parseFunction: data => {
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
        },
    };
}

export function getUsers() {
    return {
        graphqlRequest: `{
            user {
                id,
                username
            }
        }`,
    };
}

export function getDataByProjectName(projectName, userName, startDate, endDate) {
    return {
        graphqlRequest: `{
            project_v2 (
                where:{
                name:{_eq:"${projectName}"},
                }) {
                timer(where:{
                    user: {username: {_in:[${userName}]}}
                    start_datetime: {_gte:"${startDate}"}
                    end_datetime: {_lt:"${endDate}"}
                })
                 {
                    issue
                    start_datetime
                    end_datetime
                }
            }
        }`,
    };
}

export function getDatafromTimerTableToReport(userId, projectName, startDate, endDate) {
    return {
        graphqlRequest: `{
            timer_v2 (
                where:{
                user:{email: {_in:[${userId}]}},
                ${projectName.length ? `project:{name: {_in:[${projectName}]}}` : ''},
                start_datetime: {_gte: "${new Date(startDate).toISOString().slice(0, -1)}"}
                end_datetime: {_lt: "${new Date(+new Date(endDate) + 24 * 60 * 60 * 1000 - 1)
                    .toISOString()
                    .slice(0, -1)}"}
                }){
                start_datetime
                end_datetime
            }
        }`,
    };
}

export const getTeamData = {
    graphqlRequest: `{
    user (order_by: {username: asc}) {
            id,
            username,
            email,
            role{
                title
            },
            is_active
        }
    }`,
};

export function getReports(userEmails, projectNames, startTime, endTime) {
    const projectWhereStatement = projectNames
        ? `(where: {name: {_in: [${projectNames}]}}, order_by: {name: asc})`
        : '(order_by: {name: asc})';

    const userWhereStatement = userEmails.length ? `user: {email: {_in: [${userEmails}]}}` : '';
    let startTimeStatement = '';
    let endTimeStatement = '';

    if (startTime) {
        endTime = endTime ? endTime : startTime;

        startTime = new Date(startTime).toISOString().slice(0, -1);
        endTime = new Date(+new Date(endTime) + 24 * 60 * 60 * 1000 - 1).toISOString().slice(0, -1);
        startTimeStatement = `start_datetime: {_gte: "${startTime}"}`;
        endTimeStatement = `end_datetime: {_lt: "${endTime}"}`;
    }

    let timerStatementArray = [];
    if (userWhereStatement) {
        timerStatementArray.push(userWhereStatement);
    }
    if (startTimeStatement) {
        timerStatementArray.push(startTimeStatement);
    }
    if (endTimeStatement) {
        timerStatementArray.push(endTimeStatement);
    }
    const timerStatementString = timerStatementArray.join(', ');
    const timerWhereStatement = timerStatementString ? `(where: {${timerStatementString}})` : '';

    const graphqlRequest = `{
        project_v2 ${projectWhereStatement} {
            id
            name
            timer ${timerWhereStatement} {
                start_datetime
                end_datetime         
            }
        }
    }`;

    return {
        graphqlRequest,
    };
}

export function changeTimeMutation(object) {
    return {
        graphqlRequest: `
            mutation {
                update_timer_v2(
                    where: {id: {_eq: "${object.id}"}},
                _set: {
                    issue: "${object.issue}",
                    project_id: "${object.projectId}",
                     start_datetime: "${object.startDatetime}",
                        end_datetime: "${object.endDatetime}"    
                        }  
                        ) {
                            affected_rows
                            }
            }`,
    };
}

export function returnMutationLinkDeleteTimeEntries(object) {
    return {
        graphqlRequest: `mutation  {
            delete_timer_v2 (
                where: {id: {_eq: "${object.id}"}}
            ) {
                affected_rows
            }
        }`,
    };
}

export function returnMutationLinkAddProject(object) {
    return {
        graphqlRequest: `
        mutation {
            insert_project_v2(
                objects: [
                    {
                        name: "${object.name}",
                        project_color_id: "${object.colorProject.id}"
                    }
                ]
            ){
                affected_rows
            }
        }`,
    };
}

export function returnMutationLinkDeleteProject(object) {
    return {
        graphqlRequest: `
        mutation {
            delete_project(
                where:{id: {_eq:"${object.id}"}}
                ){
                    affected_rows
                }
        }`,
    };
}

export function getProjectColor() {
    return {
        graphqlRequest: `
         {
            project_color {
                id
                name
            }
        }`,
    };
}
