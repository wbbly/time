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
