import { QUploader } from "quasar";
import {
  ComponentOptionsMixin,
  ComponentPropsOptions,
  ComponentPublicInstance,
  DefineComponent,
  EmitsOptions,
  ExtractPropTypes,
  Ref,
  SetupContext,
} from "vue";
import { MetaOptions } from "./meta";

export * from "./utils/colors";
export * from "./utils/date";
export * from "./utils/dom";
export * from "./utils/event";
export * from "./utils/format";
export * from "./utils/scroll";
export * from "./utils/is";
export * from "./utils/run-sequential-promises";

import { VueStyleObjectProp } from "./api/vue-prop-types";

interface ExportFileOpts {
  mimeType?: string;
  byteOrderMark?: string | Uint8Array;
  encoding?: string;
}

// others utils
export function copyToClipboard(text: string): Promise<void>;

export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  wait?: number,
  immediate?: boolean
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) & {
  cancel(): void;
};

export function frameDebounce<F extends (...args: any[]) => any>(
  fn: F
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) & {
  cancel(): void;
};

export function exportFile(
  fileName: string,
  rawData: string | ArrayBuffer | ArrayBufferView | Blob,
  opts?: string | ExportFileOpts
): true | Error;

export function extend<R>(deep: boolean, target: any, ...sources: any[]): R;
export function extend<R>(target: object, ...sources: any[]): R;

export function openURL<F extends (...args: any[]) => any>(
  url: string,
  reject?: F,
  windowFeatures?: Object
): void;

export function throttle<F extends (...args: any[]) => any>(
  fn: F,
  limit: number
): F;

export function uid(): string;

interface MorphOptions {
  from: Element | string | (() => Element | null | undefined);
  to?: Element | string | (() => Element | null | undefined);
  onToggle?: () => void;
  waitFor?: number | "transitionend" | Promise<any>;

  duration?: number;
  easing?: string;
  delay?: number;
  fill?: string;

  style?: string | VueStyleObjectProp;
  classes?: string;

  resize?: boolean;
  useCSS?: boolean;
  hideFromClone?: boolean;
  keepToClone?: boolean;

  tween?: boolean;
  tweenFromOpacity?: number;
  tweenToOpacity?: number;

  onEnd?: (direction: "to" | "from", aborted: boolean) => void;
}

export function morph(options: MorphOptions): (abort?: boolean) => boolean;

export function getCssVar(varName: string, element?: Element): string | null;

export function setCssVar(
  varName: string,
  value: string,
  element?: Element
): void;

export class EventBus {
  on(event: string, callback: Function, ctx?: any): this;
  once(event: string, callback: Function, ctx?: any): this;
  emit(event: string, ...args: any[]): this;
  off(event: string, callback?: Function): this;
}

interface CreateMetaMixinContext extends ComponentPublicInstance {
  [index: string]: any;
}

export function createMetaMixin<
  CustomInstanceProperties extends Record<string, any> = {}
>(
  options:
    | MetaOptions
    | ((this: CreateMetaMixinContext & CustomInstanceProperties) => MetaOptions)
): ComponentOptionsMixin;

interface InjectPluginFnHelpers {
  queuedFiles: Ref<File[]>;
  uploadedFiles: Ref<File[]>;
  uploadedSize: Ref<number>;
  updateFileStatus: (
    file: File,
    status: "failed" | "idle" | "uploaded" | "uploading",
    uploadedSize?: number
  ) => void;
  isAlive: () => boolean;
}

interface InjectPluginFnOptions<Props> {
  props: ExtractPropTypes<Props>;
  emit: SetupContext["emit"];
  helpers: InjectPluginFnHelpers;
}

interface InjectPluginFnReturn {
  isUploading: Ref<boolean>;
  isBusy: Ref<boolean>;
  abort: () => void;
  upload: () => void;
}

interface CreateUploaderComponentOptions<
  Props extends ComponentPropsOptions = {},
  Emits extends EmitsOptions = []
> {
  name: string;
  props?: Props;
  emits?: Emits;
  injectPlugin(options: InjectPluginFnOptions<Props>): InjectPluginFnReturn;
}

export function createUploaderComponent<
  Props extends ComponentPropsOptions = {},
  Emits extends EmitsOptions = []
>(
  options: CreateUploaderComponentOptions<Props, Emits>
): QUploader & DefineComponent<Props, {}, {}, {}, {}, {}, {}, Emits>;
