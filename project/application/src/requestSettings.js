import { GraphQLClient } from 'graphql-request';

import { AppConfig } from './config';

export const client = new GraphQLClient(AppConfig.graphqlURL, {
    headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Access-Key': AppConfig.graphqlAccessKey,
    },
});
