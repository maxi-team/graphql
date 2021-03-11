import type {
  GraphQLResponse,
  GraphQLVariables
} from './types';

import {
  gqlErrors,
  ERROR_UNEXPECTED,
  CATEGORY_INTERNAL,
  CATEGORY_NETWORK
} from './utils';

export const gqlRequest = async <T>(url: string, query: string, variables: GraphQLVariables = {}): Promise<T> => {
  return fetch(url, {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
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
