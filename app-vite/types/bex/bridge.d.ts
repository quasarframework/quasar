import type { LiteralUnion } from "quasar";

/**
 * @example
 * declare module '@quasar/app-vite' {
 *   interface BexEventMap {
 *     'without-payload-and-response': never;
 *     'without-payload-with-response': [never, number];
 *     'with-payload-without-response': [{ test: number[] }, void];
 *     'with-payload-and-response': [{ foo: string[] }, number];
 *   }
 * }
 *
 * await bridge.send('without-payload-and-response');
 *
 * bridge.on('with-payload-without-response', ({ payload }) => {
 *   payload // type: { test: number[] }
 * });
 *
 * bridge.on('with-payload-and-response', async ({ payload }) => {
 *   const { foo } = payload; // { foo: ['a', 'b'] }
 *
 *   const result = foo[0].charCodeAt() + foo[1].charCodeAt(); // 97 + 98
 *   return result;
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

// We can't use `content@${string}-${number}` as it won't allow using dashes more than once
// We choose to not do something like `content@${string}-${0 | 1 | 2 | ... | 9}${number}` to keep the hover type simple
// It should be fine enough.
type PortName = "background" | "app" | `content@${string}-${string}`;

type BexPayload<T extends BexEventName> =
  BexEventData<T> extends never
    ? { payload?: undefined }
    : undefined extends BexEventData<T>
      ? { payload?: BexEventData<T> }
      : { payload: BexEventData<T> };

type BexMessage<T extends BexEventName> = {
  from: PortName;
  to: PortName;
  event: T;
} & BexPayload<T>;

type BexEventListener<T extends BexEventName> = (
  message: BexMessage<T>
) => BexEventResponse<T>;

type BexBridgeOptions = {
  /**
   * Whether to enable the debug mode.
   *
   * @see {@link BexBridge.setDebug} for updating the debug mode after the bridge is created
   * @see {@link BexBridge.log} for logging a message if the debug mode is enabled
   *
   * @example
   * const bridge = createBridge({ debug: process.env.DEBUGGING });
   */
  debug?: boolean;
} & (
  | {
      type: "background";
    }
  | {
      /**
       * @internal
       */
      type: "app";
    }
  | {
      type: "content";

      /**
       * The name of the content script.
       * It should be unique for each content script.
       *
       * It is used to identify the port name when sending messages.
       * A content script will have a port per each browser tab where it is injected.
       * As an example, for a content script at /src-bex/group/my-content-script.js
       * the name of the port will be in the format:
       * `content@group/my-content-script-<xxxxx>`, where `<xxxxx>`
       * is a random number between 0 and 10000.
       */
      name: string;
    }
);

export interface BexBridge {
  /**
   * The name of the port where the bridge belongs to.
   *
   * @example
   * 'background'
   *
   * @example
   * 'app'
   *
   * @example
   * 'content@sub-folder/my-content-script-1234'
   */
  readonly portName: PortName;
  /**
   * Whether the bridge is connected to the background script.
   *
   * @see {@link BexBridge.connectToBackground} for connecting to the background script
   */
  readonly isConnected: boolean;
  /**
   * The map of listeners:
   * - key: event name
   * - value: array of listener definitions
   */
  readonly listeners: Record<
    BexEventName,
    { type: "on" | "once"; callback: BexEventListener<BexEventName> }[]
  >;
  /**
   * The map of connected ports:
   * - key: port name
   * - value: port instance
   */
  readonly portMap: Record<PortName, chrome.runtime.Port>;
  /**
   * The list of connected port names.
   */
  readonly portList: PortName[];
  /**
   * The key is the message ID, which is unique for each message.
   */
  readonly messageMap: Record<
    string,
    {
      portName: PortName;
      resolve: (payload: any) => void;
      reject: (error: any) => void;
    }
  >;
  /**
   * The key is the message ID, which is unique for each message.
   */
  readonly chunkMap: Record<
    string,
    {
      portName: PortName;
      number: number;
      payload: unknown[];
    } & {
      messageType: "event-send";
      messageProps: {
        event: BexEventName;
      };
    }
  > & {
    messageType: "event-response";
    messageProps: {
      error?: {
        message: string;
        stack: string;
      };
      quiet?: boolean;
    };
  };

  constructor(options: BexBridgeOptions): BexBridge;

  /**
   * Connect to the background script.
   *
   * @see {@link BexBridge.isConnected} for checking the connection status
   *
   * @throws {string} if the bridge is already connected
   * @throws {string} if there is no bridge for the background script. If you didn't call `createBridge` in the background script, it will not be created.
   * @throws {string} if the bridge is for the background script, e.g. created with `type: 'background'`
   */
  connectToBackground(): Promise<void>;
  /**
   * Disconnect from the background script.
   *
   * @throws {string} if the bridge is not connected
   * @throws {string} if the bridge is for the background script, e.g. created with `type: 'background'`
   */
  disconnectFromBackground(): Promise<void>;

  /**
   * Send a message to the specified bridge.
   *
   * @example
   * const result = await bridge.send({
   *   event: 'sum', // example event which sums two numbers
   *   to: 'app',
   *   payload: { a: 1, b: 2 }
   * });
   * console.log(result); // 3
   */
  send<T extends BexEventName>(
    options: {
      event: T;
      /**
       * The target bridge to send the message.
       * - `background`: send to background bridge
       * - `app`: send to app bridge ($q.bex)
       * - `content@<name>-<id>`: send to the content bridge with the specified name and id
       *
       * @example <caption>Send to all ports of a content script</caption>
       * const portNames = bridge.portList.filter((portName) => portName.startsWith('content@content-script-1'));
       * for (const portName of portNames) {
       *   bridge.send({ event: 'test', to: portName, payload: 'Hello!' });
       * }
       */
      to: PortName;
    } & BexPayload<T>
  ): Promise<BexEventResponse<T>>;

  /**
   * Listen to the specified event.
   *
   * @see {@link BexBridge.off} for removing the listener
   * @see {@link BexBridge.once} for listening to the event only once
   * @see {@link BexEventMap} for strong typing your events
   */
  on<T extends BexEventName>(eventName: T, listener: BexEventListener<T>): void;
  /**
   * Listen to the specified event once.
   * The listener will be removed after the first call.
   *
   * @see {@link BexBridge.on} for listening to the event more than once
   * @see {@link BexEventMap} for strong typing your events
   */
  once<T extends BexEventName>(
    eventName: T,
    listener: BexEventListener<T>
  ): void;
  /**
   * Remove the specified listener.
   */
  off<T extends BexEventName>(
    eventName: T,
    listener: BexEventListener<T>
  ): void;

  /**
   * Update the debug mode.
   */
  setDebug(debug: boolean): void;
  /**
   * Log a message if the debug mode is enabled.
   *
   * If the last argument is an object, it will be logged using `console.dir`.
   *
   * @see {@link BexBridge.setDebug} for updating the debug mode
   */
  log(...args: any[]): void;
  /**
   * Log a warning message.
   * It will always be logged regardless of the debug mode.,
   *
   * If the last argument is an object, it will be logged using `console.dir`.
   */
  warn(...args: any[]): void;
}
