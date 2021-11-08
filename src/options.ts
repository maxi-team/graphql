import type { GraphQLRequest } from './types.js';

export const options: GraphQLRequest = {
  url: '/graphql',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};
