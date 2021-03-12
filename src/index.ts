export type {
  GraphQLError,
  GraphQLErrorLocation,
  GraphQLRequest,
  GraphQLResponse,
  GraphQLState,
  GraphQLVariables
} from './types';

export {
  options,
  gqlRequest
} from './request';

export {
  useQuery,
  useLazyQuery
} from './react';
