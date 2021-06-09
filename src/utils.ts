import type {
  GraphQLError
} from './types.js';

export const ERROR_UNEXPECTED = 'Unexpected error';

export const CATEGORY_NETWORK = 'network';
export const CATEGORY_INTERNAL = 'internal';
export const CATEGORY_CUSTOM = 'custom';

export const gqlErrors = (message: string, category = CATEGORY_CUSTOM): GraphQLError[] => {
  return [{
    message,
    extensions: {
      category
    }
  }];
};
