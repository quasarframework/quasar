import { QDialog } from "quasar";
import { MetaOptions } from "./meta";
import { QRejectedEntry } from "./api/qfile";
import {
  ComponentPublicInstance,
  MaybeRefOrGetter,
  Ref,
  ShallowRef
} from "vue";
import { QVueGlobals } from "./globals";

export function useAnimationFrame(): {
  registerAnimationFrame: (fn: () => void) => void;
  removeAnimationFrame: () => void;
};

export type DialogDismissReason =
  | "cancel"
  | "backdrop"
  | "escape"
  | "programmatic";

interface UseDialogPluginComponent {
  <T = any>(): {
    dialogRef: Ref<QDialog | null>;
    onDialogHide: (evt?: Event) => void;
    onDialogOK: (payload?: T) => void;
    onDialogCancel: () => void;
  };
  emits: ["ok", "hide"];
  emitsObject: {
    ok: (payload?: any) => true;
    hide: (reason?: DialogDismissReason) => true;
  };
}

export const useDialogPluginComponent: UseDialogPluginComponent;

export interface UseDropZoneOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxFileSize?: string | number;
  maxTotalSize?: string | number;
  maxFiles?: string | number;
  filter?: (files: readonly File[]) => readonly File[];
  onDrop?: (files: File[], evt: DragEvent) => void;
  onRejected?: (rejected: QRejectedEntry[]) => void;
  onEnter?: (evt: DragEvent) => void;
  onLeave?: (evt: DragEvent) => void;
}

export function useDropZone(options?: MaybeRefOrGetter<UseDropZoneOptions>): {
  isOverDropZone: Ref<boolean>;
  acceptedDropZoneFiles: ShallowRef<File[]>;
  rejectedDropZoneFiles: ShallowRef<QRejectedEntry[]>;
  resetDropZone: () => void;
  stopDropZone: () => void;
};

export interface UseFilePickerOptions {
  multiple?: boolean;
  accept?: string;
  capture?: "user" | "environment";
  directory?: boolean;
  maxFileSize?: string | number;
  maxTotalSize?: string | number;
  maxFiles?: string | number;
  filter?: (files: readonly File[]) => readonly File[];
  onChange?: (files: File[]) => void;
  onRejected?: (rejected: QRejectedEntry[]) => void;
  onCancel?: () => void;
}

export function useFilePicker(
  options?: MaybeRefOrGetter<UseFilePickerOptions>
): {
  acceptedPickerFiles: ShallowRef<File[]>;
  rejectedPickerFiles: ShallowRef<QRejectedEntry[]>;
  openFilePicker: (overrides?: UseFilePickerOptions) => Promise<File[] | null>;
  resetFilePicker: () => void;
};

interface UseFormChildOptions {
  validate: () => boolean | Promise<boolean>;
  resetValidation?: () => void;
  requiresQForm?: boolean;
}

export function useFormChild(options: UseFormChildOptions): void;

export interface UseElementSizeOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  debounce?: string | number;
  disabled?: boolean;
  onResize?: (elementSize: { width: number; height: number }) => void;
}

export function useElementSize(
  options?: MaybeRefOrGetter<UseElementSizeOptions>
): {
  elementSize: ShallowRef<{ width: number; height: number }>;
  refreshElementSize: () => void;
  stopElementSize: () => void;
};

export interface UseEventListenerOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
  disabled?: boolean;
}

export function useEventListener<E extends Event = Event>(
  target: MaybeRefOrGetter<
    EventTarget | ComponentPublicInstance | null | undefined
  >,
  event: MaybeRefOrGetter<string | string[]>,
  handler: (evt: E) => void,
  options?: MaybeRefOrGetter<UseEventListenerOptions>
): {
  stopEventListener: () => void;
};

export type BroadcastChannelCloseReason = "programmatic" | "unmount" | "name";

export interface UseBroadcastChannelOptions<T = any> {
  lazy?: boolean;
  onConnect?: () => void;
  onMessage?: (data: T, evt: MessageEvent<T>) => void;
  onError?: (evt: MessageEvent) => void;
  onClose?: (reason: BroadcastChannelCloseReason) => void;
}

export function useBroadcastChannel<T = any>(
  name: MaybeRefOrGetter<string>,
  options?: UseBroadcastChannelOptions<T>
): {
  isChannelConnected: Ref<boolean>;
  channelData: ShallowRef<T | null>;
  channelError: ShallowRef<MessageEvent | null>;
  postChannelMessage: (message: T) => void;
  connectChannel: () => void;
  closeChannel: () => void;
};

export type EventSourceStatus = "closed" | "connecting" | "open";

export type EventSourceCloseReason =
  | "programmatic"
  | "unmount"
  | "url"
  | "remote";

export interface UseEventSourceReconnectOptions {
  retries?: number;
  delay?: number | ((attempt: number) => number);
}

export interface UseEventSourceOptions {
  lazy?: boolean;
  withCredentials?: boolean;
  events?: string[];
  autoReconnect?: boolean | UseEventSourceReconnectOptions;
  onOpen?: (evt: Event) => void;
  onMessage?: (data: string, evt: MessageEvent<string>) => void;
  onClose?: (reason: EventSourceCloseReason) => void;
  onError?: (evt: Event) => void;
  onReconnect?: (attempt: number, delay: number) => void;
}

export function useEventSource(
  url: MaybeRefOrGetter<string | URL>,
  options?: UseEventSourceOptions
): {
  sourceStatus: Ref<EventSourceStatus>;
  sourceData: ShallowRef<string | null>;
  sourceLastEventId: ShallowRef<string | null>;
  sourceError: ShallowRef<Event | null>;
  openSource: () => void;
  closeSource: () => void;
};

export interface UseSoftFullscreenOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  fullscreen?: boolean;
  noRouteExit?: boolean;
}

export function useSoftFullscreen(
  options?: MaybeRefOrGetter<UseSoftFullscreenOptions>
): {
  inFullscreen: Ref<boolean>;
  setFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
};

export interface UseMutationOptions extends MutationObserverInit {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  once?: boolean;
  disabled?: boolean;
  onMutation?: (records: MutationRecord[]) => false | void;
}

export function useMutation(options?: MaybeRefOrGetter<UseMutationOptions>): {
  mutationRecords: ShallowRef<MutationRecord[]>;
  stopMutation: () => void;
};

export interface UseScrollOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  scrollTarget?: MaybeRefOrGetter<
    Element | Window | string | ComponentPublicInstance | null | undefined
  >;
  axis?: "vertical" | "horizontal" | "both";
  debounce?: string | number;
  disabled?: boolean;
  onScroll?: (details: UseScrollDetails) => void;
}

export interface UseScrollDetails {
  position: { top: number; left: number };
  direction: "up" | "down" | "left" | "right";
  directionChanged: boolean;
  delta: { top: number; left: number };
  inflectionPoint: { top: number; left: number };
}

export function useScroll(options?: MaybeRefOrGetter<UseScrollOptions>): {
  scrollPosition: ShallowRef<{ top: number; left: number }>;
  scrollDirection: Ref<"up" | "down" | "left" | "right">;
  scrollDirectionChanged: Ref<boolean>;
  scrollDelta: ShallowRef<{ top: number; left: number }>;
  scrollInflectionPoint: ShallowRef<{ top: number; left: number }>;
  refreshScroll: () => void;
  stopScroll: () => void;
};

export function useHydration(): {
  isHydrated: Ref<boolean>;
};

export interface UseIntersectionOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  disabled?: boolean;
  onIntersect?: (entry: IntersectionObserverEntry) => false | void;
}

export function useIntersection(
  options?: MaybeRefOrGetter<UseIntersectionOptions>
): {
  isIntersecting: Ref<boolean>;
  /** @deprecated alias of refreshIntersection() */
  refresh: () => void;
  /** @deprecated alias of stopIntersection() */
  stop: () => void;
  refreshIntersection: () => void;
  stopIntersection: () => void;
};

export function useInterval(): {
  isIntervalActive: Ref<boolean>;
  registerInterval: (fn: () => void, interval?: string | number) => void;
  removeInterval: () => void;
};

export function useId(opts?: {
  getValue?: () => string | null | undefined;
  required?: boolean;
}): Ref<string | null>;

export interface UseIdleOptions {
  timeout?: number;
  events?: string[];
  disabled?: boolean;
  onIdle?: (isIdle: boolean) => void;
}

export function useIdle(options?: MaybeRefOrGetter<UseIdleOptions>): {
  isIdle: Ref<boolean>;
  lastActive: Ref<number>;
  resetIdle: () => void;
  stopIdle: () => void;
};

export function useMeta(options: MetaOptions | (() => MetaOptions)): void;

export function useObjectUrl(
  source?: MaybeRefOrGetter<Blob | MediaSource | null | undefined>
): {
  objectUrl: Ref<string | null>;
  revokeObjectUrl: () => void;
};

export function useQuasar(): QVueGlobals;

export function useRenderCache(): {
  getCache: {
    <T>(key: string, defaultValue: T | (() => T)): T;
    <T = any>(key: string): T | undefined;
  };
  setCache: <T = any>(key: string, value: T) => void;
  hasCache: (key: string) => boolean;
  clearCache: (key?: string) => void;
};

export function useSplitAttrs(): {
  attributes: Ref<Record<string, unknown>>;
  listeners: Ref<
    Record<string, ((...args: any[]) => any) | ((...args: any[]) => any)[]>
  >;
};

export function useTick(): {
  registerTick: (fn: () => void) => void;
  removeTick: () => void;
};

export function useTimeout(): {
  isTimeoutPending: Ref<boolean>;
  registerTimeout: (fn: () => void, delay?: string | number) => void;
  removeTimeout: () => void;
};

export type WebSocketStatus = "closed" | "connecting" | "open";

export type WebSocketMessage =
  | string
  | ArrayBufferLike
  | Blob
  | ArrayBufferView;

export interface UseWebSocketReconnectOptions {
  retries?: number;
  delay?: number | ((attempt: number) => number);
}

export interface UseWebSocketHeartbeatOptions {
  message?: WebSocketMessage;
  interval?: number;
}

export type WebSocketCloseReason =
  | "programmatic"
  | "unmount"
  | "url"
  | "remote";

export interface UseWebSocketOptions<Data = any> {
  lazy?: boolean;
  protocols?: string | string[];
  binaryType?: BinaryType;
  autoReconnect?: boolean | UseWebSocketReconnectOptions;
  heartbeat?: boolean | UseWebSocketHeartbeatOptions;
  onOpen?: (evt: Event) => void;
  onMessage?: (data: Data, evt: MessageEvent<Data>) => void;
  onClose?: (evt: CloseEvent, reason: WebSocketCloseReason) => void;
  onError?: (evt: Event) => void;
  onReconnect?: (attempt: number, delay: number) => void;
}

export function useWebSocket<Data = any>(
  url: MaybeRefOrGetter<string | URL>,
  options?: UseWebSocketOptions<Data>
): {
  socketStatus: Ref<WebSocketStatus>;
  socketData: ShallowRef<Data | null>;
  socketError: ShallowRef<Event | null>;
  sendSocketMessage: (message: WebSocketMessage) => void;
  openSocket: () => void;
  closeSocket: (code?: number, reason?: string) => void;
};

export type UseWebWorkerSource =
  | string
  | URL
  | Worker
  | ((options?: WorkerOptions) => Worker)
  | (new (options?: WorkerOptions) => Worker);

export interface UseWebWorkerOptions<Data = any> extends WorkerOptions {
  lazy?: boolean;
  onMessage?: (data: Data, evt: MessageEvent<Data>) => void;
  onError?: (evt: ErrorEvent | MessageEvent) => void;
  onCreate?: (worker: Worker) => void;
  onTerminate?: (worker: Worker, reason: WebWorkerTerminateReason) => void;
}

export type WebWorkerTerminateReason = "terminate" | "unmount";

export type WebWorkerStatus = "idle" | "running" | "terminated";

export function useWebWorker<Data = any>(
  source: UseWebWorkerSource,
  options?: UseWebWorkerOptions<Data>
): {
  workerStatus: Ref<WebWorkerStatus>;
  workerData: ShallowRef<Data | null>;
  workerError: ShallowRef<ErrorEvent | MessageEvent | null>;
  postWorkerMessage: (message: any, transfer?: Transferable[]) => void;
  terminateWorker: () => void;
};

export type WebWorkerFnStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "timeout";

export interface UseWebWorkerFnOptions<
  Args extends any[] = any[],
  Result = any
> {
  timeout?: number;
  dependencies?: (string | URL)[];
  localDependencies?: Function[];
  transfer?: (...args: Args) => Transferable[];
  onSuccess?: (result: Result, args: Args) => void;
  onError?: (error: unknown, args: Args) => void;
  onTimeout?: (args: Args) => void;
  onTerminate?: (reason: WebWorkerFnTerminateReason) => void;
}

export type WebWorkerFnTerminateReason =
  | WebWorkerTerminateReason
  | "timeout"
  | "error";

export function useWebWorkerFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: UseWebWorkerFnOptions<Parameters<Fn>, Awaited<ReturnType<Fn>>>
): {
  workerFnStatus: Ref<WebWorkerFnStatus>;
  runWorkerFn: (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>;
  terminateWorkerFn: () => void;
};
