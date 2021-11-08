import type {
  GraphQLErrorHandler,
  GraphQLNextHandler,
  GraphQLVariables
} from './types.js';

import { fastUnique } from '@mntm/shared';

import {
  CATEGORY_INTERNAL,
  CATEGORY_NETWORK,
  ERROR_UNEXPECTED,
  gqlErrors
} from './utils.js';

import { options } from './options.js';

const enum Message {
  CONNECTION_INIT = 'connection_init',
  CONNECTION_ACK = 'connection_ack',
  START = 'start',
  STOP = 'stop',
  DATA = 'data',
  COMPLETE = 'complete'
}

const stringify = (id: string, type: Message, payload: any) => {
  return JSON.stringify({ id, type, payload });
};

export const gqlSubscribe = <T>(
  query: string,
  variables: GraphQLVariables,
  next: GraphQLNextHandler<T>,
  error: GraphQLErrorHandler,
  close: VoidFunction
) => {
  const client = new WebSocket(options.url, 'graphql-ws');

  const id = fastUnique();

  const init = () => {
    client.send(stringify(id, Message.CONNECTION_INIT, options.headers));
    client.send(stringify(id, Message.START, {
      extensions: {},
      operationName: null,
      query,
      variables
    }));
  };

  const complete = () => {
    client.send(stringify(id, Message.STOP, null));
    client.close();
  };

  const fatal = () => {
    error(gqlErrors(ERROR_UNEXPECTED, CATEGORY_NETWORK));
    client.close();
  };

  const handle = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.type === Message.DATA) {
      if (message.id !== id) {
        return;
      }

      const response = message.payload;

      if (response.errors && response.errors.length > 0) {
        error(response.errors);

        return;
      }

      if (response.data) {
        next(response.data);

        return;
      }

      error(gqlErrors(ERROR_UNEXPECTED, CATEGORY_INTERNAL));

      return;
    }

    if (message.type === Message.COMPLETE) {
      complete();
    }
  };

  const connect = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.type === Message.CONNECTION_ACK) {
      client.onmessage = handle;
    }
  };

  client.onmessage = connect;
  client.onopen = init;
  client.onerror = fatal;
  client.onclose = close;

  return complete;
};
