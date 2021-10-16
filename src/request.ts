import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLVariables
} from './types.js';

import {
  CATEGORY_INTERNAL,
  CATEGORY_NETWORK,
  ERROR_UNEXPECTED,
  gqlErrors
} from './utils.js';

export const options: GraphQLRequest = {
  url: '/graphql',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

export const gqlRequest = <T = unknown>(query: string, variables: GraphQLVariables = {}): Promise<T> => {
  return fetch(options.url, {
    cache: 'no-store',
    method: 'POST',
    headers: options.headers,
    body: JSON.stringify({
      operationName: null,
      query,
      variables
    })
  }).then((response) => {
    if (!response.ok) {
      throw new Error(ERROR_UNEXPECTED);
    }

    return response.json();
  }).catch((ex) => {
    if (ex instanceof Error) {
      throw gqlErrors(ex.message, CATEGORY_NETWORK);
    }

    throw gqlErrors(ERROR_UNEXPECTED, CATEGORY_NETWORK);
  }).then((response: GraphQLResponse<T>) => {
    if (response.errors && response.errors.length > 0) {
      throw response.errors;
    }

    if (response.data) {
      return response.data;
    }

    throw gqlErrors(ERROR_UNEXPECTED, CATEGORY_INTERNAL);
  });
};
