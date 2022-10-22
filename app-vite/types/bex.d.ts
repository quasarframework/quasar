import type { EventEmitter } from "events";
import type { LiteralUnion } from "quasar";

type BexObjectMessage = { event: string; payload: any };
type BexMessage = string | BexObjectMessage;
interface BexWall {
  listen(callback: (messages: BexMessage | BexMessage[]) => void): void;
  send(data: BexObjectMessage[]): void;
}

/**
 * @example
 * declare module '@quasar/app-vite' {
 *   interface BexEventMap {
 *     'without-payload-and-response': never;
 *     'without-payload-with-response': [never, number];
 *     'with-payload-without-response': [{ test: number[] }, never];
 *     'with-payload-and-response': [{ foo: string[] }, number];
 *   }
 * }
 *
 * bridge.send('without-payload-and-response');
 *
 * bridge.on('with-payload-without-response', ({ data }) => {
 *   data // type: { test: number[] }
 * });
 *
 * bridge.on('with-payload-and-response', ({ data, respond }) => {
 *   const { foo } = data; // { foo: ['a', 'b'] }
 *
 *   const result = foo[0].charCodeAt() + foo[1].charCodeAt(); // 97 + 98
 *   void respond(result);
 * });
 * const response = await bridge.send('with-payload-and-response', { foo: ['a', 'b'] });
 * console.log(response); // 195
 */
export interface BexEventMap {}

type BexEventName = LiteralUnion<Exclude<keyof BexEventMap, number>>;
type BexEventEntry<
  K extends BexEventName,
  P = K extends keyof BexEventMap ? BexEventMap[K] : any[]
> = P extends never
  ? [never, never]
  : P extends [unknown, unknown]
  ? P
  : [any, any];
type BexEventData<T extends BexEventName> = BexEventEntry<T>[0];
type BexEventResponse<T extends BexEventName> = BexEventEntry<T>[1];

type BexPayload<TData, TResponse> = {
  data: TData;
  /** @deprecated Use {@link BexPayload.respond} instead */
  eventResponseKey: string;
  /**
   * Calling this will resolve the Promise of the `send()` call.
   * You can use this to communicate back with the sender.
   */
  respond: (
    ...payload: TResponse extends never ? [] : [TResponse]
  ) => Promise<BexPayload<TData, TResponse>>;
};
type BexEventListener<T extends BexEventName> = (
  payload: BexPayload<BexEventData<T>, BexEventResponse<T>>
) => void;

export interface BexBridge extends EventEmitter {
  constructor(wall: BexWall): BexBridge;

  getEvents(): {
    [T in BexEventName]: (
      ...payload: BexEventData<T> extends never ? [] : [BexEventData<T>]
    ) => void;
  };

  send<T extends BexEventName>(
    eventName: T,
    ...payload: BexEventData<T> extends never ? [] : [BexEventData<T>]
  ): Promise<BexPayload<BexEventResponse<T>, BexEventData<T>>>;

  on<T extends BexEventName>(eventName: T, listener: BexEventListener<T>): this;
  once<T extends BexEventName>(
    eventName: T,
    listener: BexEventListener<T>
  ): this;
  off<T extends BexEventName>(
    eventName: T,
    listener: BexEventListener<T>
  ): this;
}

export type GlobalQuasarBex = BexBridge;

interface BexConnection {
  /** @see https://developer.chrome.com/docs/extensions/reference/runtime/#type-Port */
  port: chrome.runtime.Port;

  connected: boolean;
  listening: boolean;
}

export type BexBackgroundCallback = (
  bridge: BexBridge,
  connections: {
    [connectionId: string]: {
      app?: BexConnection;
      contentScript?: BexConnection;
    };
  }
) => void;

export type BexContentCallback = (bridge: BexBridge) => void;

export type BexDomCallback = (bridge: BexBridge) => void;
