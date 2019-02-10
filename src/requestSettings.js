import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("https://la-ge.herokuapp.com/v1alpha1/graphql", {
    "headers": {
        "Content-Type": "application/json",
        "X-Hasura-Access-Key": "lalala"
    }
});