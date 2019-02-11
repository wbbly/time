export const getProjects = `{
    project(order_by: {created_at: desc}) {
        id
        name
        projectStatus
        team
    }
}`;

export const getTodayTimeEntries = `{
    timer(
        where: {user_id: {_eq: 1}, start_datetime: {_gte: "2018-07-23"}}
        order_by:{start_datetime: desc}
    ) {
        project {
            name
        }
        issue
        start_datetime
        end_datetime
    }
}`;

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
    }
`;

export const deleteProject = `
    mutation($id: Int!) {
        delete_project(
            where: {id: {_eq:$id}}
        ){
            affected_rows
        }
    }
`;
