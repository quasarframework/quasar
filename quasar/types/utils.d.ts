export interface BuildDateOptions {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  date?: number;
  month?: number;
  year?: number;
}
export interface ModifyDateOptions {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  month?: number;
  year?: number;
}

export type DateUnitOptions = "second" | "minute" | "hour" | "day" | "month" | "year";

export namespace date {
  function formatDate(originalDate: Date | number | undefined, format: string): string;
  function buildDate(val: BuildDateOptions, utc?: boolean): string;
  function addToDate(originalDate: Date | number, options: ModifyDateOptions): Date;
  function subtractFromDate(originalDate: Date | number, options: ModifyDateOptions): Date;
  function startOfDate(val: Date | number, option: DateUnitOptions) : Date;
  function endOfDate(val: Date | number, option: DateUnitOptions) : Date;
  function getDayOfWeek(newDate: Date | number): number;
}

export interface NotifyAction {
    label: string;
    icon?: string;
    noDismiss?: boolean;
    handler: Function;
}

export interface NotifyOptions {
  message: string;
  timeout?: number;
  type?: string;
  color?: string;
  textColor?: string;
  icon?: string;
  avitar?: string;
  detail?: string;
  position?: string; 
  closeBtn?: boolean;
  actions?: NotifyAction[];
  onDismiss?: Function;
}
export namespace Notify{
  function create(message: string | NotifyOptions): void;
}

export function debounce(fn: Function, wait?: Number, immediate?: boolean) : Function

export function openURL(url: string): void;

export function extend(...args: any[]): any;