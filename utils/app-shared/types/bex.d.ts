export interface GlobalQuasarBex {
  send(eventName: string, payload?: object): Promise<any>;
  on(eventName: string, eventListener: (payload?: object) => any): void;
  off(eventName: string, eventListener: (payload?: object) => any): void;
}
