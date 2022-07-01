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
 * bridge.send('without-payload-and-response')
 *
 * bridge.on('with-payload-without-response', ({ data }) => {
 *   data // type: { test: number[] }
 * })
 *
 * const response = await bridge.send('with-payload-and-response', { foo: ['a', 'b'] });
 * console.log(typeof response) // 'number'
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

type BexEventListener<T extends BexEventName> = (payload: {
  data: BexEventData<T>;
  eventResponseKey: string;
  respond: (
    ...payload: BexEventResponse<T> extends never ? [] : [BexEventResponse<T>]
  ) => Promise<void>;
}) => void;

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
  ): Promise<BexEventResponse<T>>;

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
