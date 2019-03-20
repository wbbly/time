export const getProjects = `{
    project(order_by: {created_at: desc}) {
        id
        name
        projectStatus
        team
        colorProject
    }
}`;

export function getTodayTimeEntries(email) {
    return `{
        timeTracker (where: {email: {_eq: "${email}"}},order_by: {date: desc}) {
            id
            name
            date
            timeFrom
            timeTo
            timePassed
            project
        }
    }`;
}

export function getProjectTime(email) {
    return `{
        timeTracker (where: {email: {_eq: "${email}"}},order_by: {date: desc}) {
            timePassed
            project
        }
    }`;
}

export function getUsers() {
    return `{
        timeTracker {
            email
        }
    }`;
}

export function getProjectReport(object) {
    return `{
        timeTracker (
            where: {
                _and:[
                    {project:{_eq: "${object.projectId}"}},
                    {email:{_eq: "${object.activeEmail}"}},
                    {date: {_gte: "${object.from}"}},
                    {date: {_lte: "${object.to}"}},
                ]
            },
            order_by: {date: desc}) {
                id
                name
                date
                timeFrom
                timeTo
                timePassed
                project
        }
    }`;
}

export const getTeamData = `{
    team (order_by: {name: desc}){
        id
        name
        email
        status
    }
}`;

export function getDateAndTimeToGraphick(object) {
    return `{
        timeTracker (
            where: {
                _and: [
                    {email: {_eq: "${object.email}"}},
                    {date: {_gte: "${object.from}"}},
                    {date: {_lte: "${object.to}"}},
                ]
            },
            order_by: {date: desc}) {
            date
            timePassed
        }
    }`;
}

export function getProjectANndTimeToGraphick(object) {
    return `{
        timeTracker (where: {
        _and: [
            {email: {_eq: "${object.email}"}}
            {date: {_gte: "${object.from}"}},
            {date: {_lte: "${object.to}"}},
        ]
        },order_by: {date: desc}) {
            project
            timePassed
        }
    }`;
}

export function returnMutationLinkAddTimeEntries(object) {
    return `
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
                        userId: "${object.userId}",
                        email: "${object.email}",
                    }
                ]
            ){
                affected_rows
            }
        }`;
}

export function returnMutationLinkAddUser(object) {
    return `
        mutation {
            insert_team(
                objects: [
                    {
                        name: "${object.name}",
                        email: "${object.email}",
                        status: "${object.status}",
                    }
                ]
            ){
                affected_rows
            }
        }`;
}

export function returnMutationLinkDeleteTimeEntries(object) {
    return `
        mutation  {
            delete_timeTracker (
                where: {id: {_eq: ${object.id}}}
            ) {
                affected_rows
            }
        }`;
}

export function returnMutationLinkAddProject(object) {
    return `
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
        }`;
}

export function returnMutationLinkDeleteProject(object) {
    return `
        mutation {
            delete_project(
                where:{id: {_eq:"${object.id}"}}
                ){
                    affected_rows
                }
        }`;
}

export function returnMutationUpdateTimerProject(id, object) {
    return `
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
        }`;
}

export const addProject = `
    mutation($name: String!) {
        insert_project(
            objects: [
                {
                  name: $name,
                }
              ]
        ){
            affected_rows
        }
    }`;
