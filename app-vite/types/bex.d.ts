import type { EventEmitter } from 'events';

type BexObjectMessage = { event: string; payload: any };
type BexMessage = string | BexObjectMessage;
interface BexWall {
  listen (callback: (messages: BexMessage | BexMessage[]) => void): void;
  send (data: BexObjectMessage[]): void;
}

type BexEventPayload = { data: any; eventResponseKey: string; };
type BexEventListener = (payload: BexEventPayload) => void;
export interface BexBridge extends EventEmitter {
  constructor(wall: BexWall): BexBridge;

  send(eventName: string, payload?: Record<string, any>): Promise<any>;
  getEvents(): { [eventName: string]: (payload?: any) => void };

  on(eventName: string | symbol, listener: BexEventListener): this;
  once(eventName: string | symbol, listener: BexEventListener): this;
  off(eventName: string | symbol, listener: BexEventListener): this;
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
  },
) => void;

export type BexContentCallback = (bridge: BexBridge) => void;

export type BexDomCallback = (bridge: BexBridge) => void;
