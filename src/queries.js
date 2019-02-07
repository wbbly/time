import gql from 'graphql-tag';

export const getProjects = gql`{
    project(order_by: {created_at: desc}) {
        id
        name
    }
}`;