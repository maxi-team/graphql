import { useEffect, useState } from 'react';
import { useHandler, constDeps } from '@mntm/shared';

import { gqlRequest } from './request';
import type { GraphQLVariables, GraphQLState } from './types';

const DEFAULT_STATE = {
  fetching: false,
  data: null,
  errors: null
};

export const useLazyQuery = <T>(query: string) => {
  const [state, setState] = useState<GraphQLState<T>>(DEFAULT_STATE);
  const mutate = useHandler((variables: GraphQLVariables) => {
    setState({
      fetching: true,
      data: null,
      errors: null
    });
    gqlRequest<T>('', query, variables).then((data) => {
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
  return [state, mutate] as const;
};

export const useQuery = <T>(query: string, variables: GraphQLVariables) => {
  const [state, mutate] = useLazyQuery<T>(query);
  useEffect(() => {
    mutate(variables);
  }, constDeps);
  return state;
};
