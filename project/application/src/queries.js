export const getProjects = {
    graphqlRequest: `{ project(order_by: {name: desc}) {
            id
            name
            projectStatus
            team
            colorProject
        }
    }`,
};

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
    graphqlRequest: `{ project_v2 (limit: 100) {
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
        graphqlRequest: `{ project_v2 (where: {user_id: {_eq: "${id}"}}) {
        id
        is_active
        name
        timer  {
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
        graphqlRequest: `{ timer_v2 (where: {user_id: {_eq: "${id}"}},order_by: {start_datetime: desc}) {
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
                    issue,
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

export function getProjectTime(email) {
    return {
        graphqlRequest: `{
            timeTracker (where: {email: {_eq: "${email}"}},order_by: {date: desc, timeFrom: desc}) {
                timePassed
                project
            }
        }`,
    };
}

export function getUsers() {
    return {
        graphqlRequest: `{
            timeTracker {
                email
            }
        }`,
    };
}

export function getProjectReport(object) {
    return {
        graphqlRequest: `{
            timeTracker (
                where: {
                    _and:[
                        {project:{_eq: "${object.projectId}"}},
                        {email:{_eq: "${object.activeEmail}"}},
                        {date: {_gte: "${object.from}"}},
                        {date: {_lte: "${object.to}"}},
                    ]
                },
            order_by: {date: desc, timeFrom: desc}) {
                id
                name
                date
                timeFrom
                timeTo
                timePassed
                project
            }
        }`,
    };
}

export const getTeamData = {
    graphqlRequest: `{
      user{
          id,
          username,
          email,
          role{
              title
          }
      }
  }`,
};

export function getDateAndTimeToGraphick(object) {
    return {
        graphqlRequest: `{
            timeTracker (
                where: {
                    _and: [
                        {email: {_eq: "${object.email}"}},
                        {date: {_gte: "${object.from}"}},
                        {date: {_lte: "${object.to}"}},
                    ]
                },
                order_by: {date: desc, timeFrom: desc}) {
                date
                timePassed
            }
        }`,
    };
}

export function getReports(userId, projectId, startTime, endTime) {
    const userWhereStatement = userId ? `(where: {id: {_eq: "${userId}"}})` : '';

    const projectWhereStatement = projectId ? `project_id: {_eq: "${projectId}"}` : '';
    let startTimeStatement = '';
    let endTimeStatement = '';

    if (startTime) {
        endTime = endTime ? endTime : startTime;

        startTime = new Date(startTime).toISOString();
        endTime = new Date(+new Date(endTime) + 24 * 60 * 60 * 1000 - 1).toISOString();
        startTimeStatement = `start_datetime: {_gte: "${startTime}"}`;
        endTimeStatement = `end_datetime: {_lt: "${endTime}"}`;
    }

    let timerStatementArray = [];
    if (projectWhereStatement) {
        timerStatementArray.push(projectWhereStatement);
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
      user ${userWhereStatement} {
        id
        username
        timer ${timerWhereStatement} {
          issue
          start_datetime
          end_datetime
          project_id
        }
      }
    }`;

    return {
        graphqlRequest,
    };
}

export function getProjectANndTimeToGraphick(object) {
    return {
        graphqlRequest: `{
            timeTracker (where: {
            _and: [
                {email: {_eq: "${object.email}"}}
                {date: {_gte: "${object.from}"}},
                {date: {_lte: "${object.to}"}},
            ]
            },order_by: {date: desc, timeFrom: desc}) {
                project
                timePassed
            }
        }`,
    };
}

export function returnMutationLinkAddTimeEntries(object) {
    return {
        graphqlRequest: `
        mutation {
            insert_timeTracker(
                objects: [
                    {
                        name: "${object.name}",
                        date: "${object.date}",
                        timeFrom: "${object.timeFrom}",
                        timeTo: "${object.timeTo}",
                        timePassed: "${object.timePassed}",
                        project: "${object.project}",
                        email: "${object.email}",
                    }
                ]
            ){
                affected_rows
            }
        }`,
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
            insert_project(
                objects: [
                    {
                        name: "${object.name}",
                        projectStatus: "21",
                        team: "HR"
                        colorProject: "${object.colorProject}"
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

export function returnMutationUpdateTimerProject(id, object) {
    return {
        graphqlRequest: `
        mutation {
            update_timeTracker(
                where: {id: {_eq:  ${id}}},
                _set: {
                    timeFrom: "${object.timeFrom}"
                    timeTo: "${object.timeTo}"
                    name: "${object.name}"
                }
            ) {
                affected_rows
            }
        }`,
    };
}
