import { QDialog } from "quasar";
import { MetaOptions } from "./meta";
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
  onRejected?: (rejected: UseFilePickerRejectedEntry[]) => void;
  onCancel?: () => void;
}

export interface UseFilePickerRejectedEntry {
  failedPropValidation:
    | "accept"
    | "max-file-size"
    | "max-total-size"
    | "filter"
    | "max-files";
  file: File;
}

export function useFilePicker(
  options?: MaybeRefOrGetter<UseFilePickerOptions>
): {
  pickedFiles: Ref<File[]>;
  rejectedFiles: Ref<UseFilePickerRejectedEntry[]>;
  openFilePicker: (overrides?: UseFilePickerOptions) => Promise<File[] | null>;
  resetFilePicker: () => void;
};

interface UseFormChildOptions {
  validate: () => boolean | Promise<boolean>;
  resetValidation?: () => void;
  requiresQForm?: boolean;
}

export function useFormChild(options: UseFormChildOptions): void;

export interface UseElementResizeOptions {
  target?: MaybeRefOrGetter<
    Element | ComponentPublicInstance | null | undefined
  >;
  debounce?: string | number;
  disabled?: boolean;
  onResize?: (size: { width: number; height: number }) => void;
}

export function useElementResize(
  options?: MaybeRefOrGetter<UseElementResizeOptions>
): {
  width: Ref<number>;
  height: Ref<number>;
  refresh: () => void;
  stop: () => void;
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
  stop: () => void;
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
  onMutation?: (records: MutationRecord[]) => boolean | void;
}

export function useMutation(options?: MaybeRefOrGetter<UseMutationOptions>): {
  mutationRecords: Ref<MutationRecord[]>;
  stop: () => void;
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
  position: Ref<{ top: number; left: number }>;
  direction: Ref<"up" | "down" | "left" | "right">;
  directionChanged: Ref<boolean>;
  delta: Ref<{ top: number; left: number }>;
  inflectionPoint: Ref<{ top: number; left: number }>;
  refresh: () => void;
  stop: () => void;
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
  onIntersect?: (entry: IntersectionObserverEntry) => boolean | void;
}

export function useIntersection(
  options?: MaybeRefOrGetter<UseIntersectionOptions>
): {
  isIntersecting: Ref<boolean>;
  refresh: () => void;
  stop: () => void;
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
  stop: () => void;
};

export function useMeta(options: MetaOptions | (() => MetaOptions)): void;

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

export interface UseWebSocketOptions {
  protocols?: string | string[];
  binaryType?: BinaryType;
  manualOpen?: boolean;
  autoReconnect?: boolean | UseWebSocketReconnectOptions;
  heartbeat?: boolean | UseWebSocketHeartbeatOptions;
  onOpen?: (evt: Event) => void;
  onMessage?: (data: any, evt: MessageEvent) => void;
  onClose?: (evt: CloseEvent, reason: WebSocketCloseReason) => void;
  onError?: (evt: Event) => void;
  onReconnect?: (attempt: number, delay: number) => void;
}

export function useWebSocket<Data = any>(
  url: MaybeRefOrGetter<string | URL>,
  options?: UseWebSocketOptions
): {
  socketStatus: Ref<WebSocketStatus>;
  data: ShallowRef<Data | null>;
  error: ShallowRef<Event | null>;
  send: (message: WebSocketMessage) => void;
  openSocket: () => void;
  closeSocket: (code?: number, reason?: string) => void;
};

export type UseWebWorkerSource =
  | string
  | URL
  | Worker
  | ((options?: WorkerOptions) => Worker)
  | (new (options?: WorkerOptions) => Worker);

export interface UseWebWorkerOptions extends WorkerOptions {
  eager?: boolean;
  onMessage?: (data: any, evt: MessageEvent) => void;
  onError?: (evt: ErrorEvent | MessageEvent) => void;
  onCreate?: (worker: Worker) => void;
  onTerminate?: (worker: Worker) => void;
}

export type WebWorkerStatus = "idle" | "running" | "terminated";

export function useWebWorker<Data = any>(
  source: UseWebWorkerSource,
  options?: UseWebWorkerOptions
): {
  workerStatus: Ref<WebWorkerStatus>;
  data: ShallowRef<Data | null>;
  error: ShallowRef<ErrorEvent | MessageEvent | null>;
  postMessage: (message: any, transfer?: Transferable[]) => void;
  terminate: () => void;
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
  onTerminate?: () => void;
}

export function useWebWorkerFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: UseWebWorkerFnOptions<Parameters<Fn>, Awaited<ReturnType<Fn>>>
): {
  runWorkerFn: (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>;
  workerFnStatus: Ref<WebWorkerFnStatus>;
  terminateWorkerFn: () => void;
};
