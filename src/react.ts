import type {
  GraphQLState,
  GraphQLVariables
} from './types.js';

import {
  useState
} from 'react';

import {
  useHandler,
  useMount,
  useMountedRef
} from '@mntm/shared';

import {
  gqlRequest
} from './request.js';

const STATE_DEFAULT = {
  fetching: false,
  data: null,
  errors: null
} as const;

const STATE_LOADING = {
  fetching: true,
  data: null,
  errors: null
} as const;

export const useRequest = <T = any, V extends GraphQLVariables = GraphQLVariables>(query: string, defaultState: GraphQLState<T>) => {
  const [state, setState] = useState<GraphQLState<T>>(defaultState);
  const mounted = useMountedRef();
  const run = useHandler((variables: V = {} as V) => {
    setState(STATE_LOADING);
    gqlRequest<T>(query, variables).then((data) => {
      return {
        fetching: false,
        data,
        errors: null
      };
    }).catch((ex) => {
      return {
        fetching: false,
        data: null,
        errors: ex
      };
    }).then((next) => {
      if (mounted.current) {
        setState(next);
      }
    });
  });

  return [state, run] as const;
};

export const useLazyQuery = <T = any, V extends GraphQLVariables = GraphQLVariables>(query: string) => {
  return useRequest<T, V>(query, STATE_DEFAULT);
};

export const useQuery = <T = any, V extends GraphQLVariables = GraphQLVariables>(query: string, variables: V = {} as V) => {
  const [state, run] = useRequest<T, V>(query, STATE_LOADING);
  const rerun = useHandler(() => {
    run(variables);
  });

  useMount(rerun);

  return [state, rerun] as const;
};
