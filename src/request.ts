import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLVariables
} from './types.js';

import {
  gqlErrors,
  ERROR_UNEXPECTED,
  CATEGORY_INTERNAL,
  CATEGORY_NETWORK
} from './utils.js';

export const options: GraphQLRequest = {
  url: '/graphql',
  headers: {}
};

export const gqlRequest = async <T = any>(query: string, variables: GraphQLVariables = {}): Promise<T> => {
  return fetch(options.url, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify({
      operationName: null,
      query,
      variables
    })
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(ERROR_UNEXPECTED);
    }
    return response.json();
  }).catch((e) => {
    if (e instanceof Error) {
      throw gqlErrors(e.message, CATEGORY_NETWORK);
    }
    throw gqlErrors(ERROR_UNEXPECTED, CATEGORY_NETWORK);
  }).then((response: GraphQLResponse<T>) => {
    if (response.errors && response.errors.length) {
      throw response.errors;
    }
    if (response.data) {
      return response.data;
    }
    throw gqlErrors(ERROR_UNEXPECTED, CATEGORY_INTERNAL);
  });
};
