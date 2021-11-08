import type {
  GraphQLError,
  GraphQLStableState,
  GraphQLState,
  GraphQLVariables
} from './types.js';

import {
  useCallback,
  useState
} from 'react';

import {
  useCreation,
  useHandler,
  useRenderEffect,
  useUnmount
} from '@mntm/shared';

import {
  gqlRequest
} from './request.js';

import {
  gqlSubscribe
} from './subscribe.js';

export const STATE_DEFAULT = {
  fetching: false,
  data: null,
  errors: null
} as const;

export const STATE_LOADING = {
  fetching: true,
  data: null,
  errors: null
} as const;

export const useRequest = <T = unknown, V extends GraphQLVariables = GraphQLVariables>(query: string, update: (state: GraphQLStableState<T>) => void) => {
  return useHandler((variables: V = {} as V) => {
    update(STATE_LOADING);
    gqlRequest<T>(query, variables).then((data) => {
      return {
        fetching: false,
        data,
        errors: null
      } as const;
    }, (ex: GraphQLError[]) => {
      return {
        fetching: false,
        data: null,
        errors: ex
      } as const;
    }).then(update);
  });
};

export const useLazyQuery = <T = unknown, V extends GraphQLVariables = GraphQLVariables>(query: string) => {
  const [state, setState] = useState<GraphQLState<T>>(STATE_DEFAULT);

  const run = useRequest<T, V>(query, setState);

  return [state, run] as const;
};

export const useQuery = <T = unknown, V extends GraphQLVariables = GraphQLVariables>(query: string, variables: V = {} as V) => {
  const [state, setState] = useState<GraphQLStableState<T>>(STATE_LOADING);

  const run = useRequest<T, V>(query, setState);

  const exec = () => run(variables);
  const rerun = useCallback(exec, [variables]);

  useRenderEffect(exec);

  return [state, rerun] as const;
};

export const useSubscribe = <T = unknown, V extends GraphQLVariables = GraphQLVariables>(query: string, variables: V = {} as V) => {
  const [state, setState] = useState<GraphQLState<T>>(STATE_LOADING);

  const stop = useCreation(() => {
    return gqlSubscribe<T>(query, variables, (data) => {
      setState({
        fetching: true,
        data,
        errors: null
      });
    }, (errors) => {
      setState({
        fetching: true,
        data: null,
        errors
      });
    }, () => {
      setState({
        fetching: false,
        data: null,
        errors: null
      });
    });
  });

  useUnmount(stop);

  return [state, stop];
};
