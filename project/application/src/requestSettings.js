import { GraphQLClient } from 'graphql-request';
import { AppConfig } from './config';

const graphQLClient = new GraphQLClient(AppConfig.graphqlURL, {
    headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Access-Key': AppConfig.graphqlAccessKey,
    },
});

export const client = {
    request: ({ graphqlRequest, parseFunction }) => {
        return new Promise((resolve, reject) => {
            graphQLClient.request(graphqlRequest)
                .then((data) => {
                    if (typeof parseFunction === 'function') {
                        resolve(parseFunction(data));
                    }

                    return resolve(data);
                });
        })
    }
}