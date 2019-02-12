export const getProjects = `{
    project(order_by: {created_at: desc}) {
        id
        name
        projectStatus
        team
    }
}`;

export const getTodayTimeEntries = `{
    timeTracker {
        id
        name
        date
        timeFrom
        timeTo
        timePassed
        project
    }
}`;

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
                    userId: "${object.userId}"
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
