import type {
  GraphQLVariables,
  GraphQLState
} from './types';

import {
  useEffect,
  useState
} from 'react';

import {
  useHandler,
  constDeps
} from '@mntm/shared';

import {
  gqlRequest
} from './request';

const STATE_DEFAULT = {
  fetching: false,
  data: null,
  errors: null
};

const STATE_LOADING = {
  fetching: false,
  data: null,
  errors: null
};

export const useLazyQuery = <T>(query: string) => {
  const [state, setState] = useState<GraphQLState<T>>(STATE_DEFAULT);
  const run = useHandler((variables: GraphQLVariables) => {
    setState(STATE_LOADING);
    gqlRequest<T>(query, variables).then((data) => {
      setState({
        fetching: false,
        data,
        errors: null
      });
    }).catch((errors) => {
      setState({
        fetching: false,
        data: null,
        errors
      });
    });
  });
  return [state, run] as const;
};

export const useQuery = <T>(query: string, variables: GraphQLVariables) => {
  const [state, setState] = useState<GraphQLState<T>>(STATE_LOADING);
  const run = useHandler(() => {
    setState(STATE_LOADING);
    gqlRequest<T>(query, variables).then((data) => {
      setState({
        fetching: false,
        data,
        errors: null
      });
    }).catch((errors) => {
      setState({
        fetching: false,
        data: null,
        errors
      });
    });
  });
  useEffect(run, constDeps);
  return [state, run] as const;
};
