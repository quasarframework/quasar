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
