type GraphQLPrimitive = string | number | boolean | null;
interface GraphQLEntity { [field: string]: GraphQLPrimitive | GraphQLArray | GraphQLEntity }
type GraphQLArray = Array<GraphQLPrimitive | GraphQLArray | GraphQLEntity>;
export declare type GraphQLVariables = Record<string, GraphQLPrimitive | GraphQLEntity | GraphQLArray>;

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

export declare type GraphQLRequest = {
  url: string;
  headers: Record<string, string>;
};
