import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient('/graphql', {
  credentials: 'include',
});