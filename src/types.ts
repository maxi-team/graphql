export declare type GraphQLVariables = Record<string, string | number | null>;

export declare type GraphQLErrorLocation = {
  line: number;
  column: number;
};

export declare type GraphQLError = {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export declare type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export declare type GraphQLState<T> = {
  fetching: boolean;
  data: T | null;
  errors: GraphQLError[] | null;
};
