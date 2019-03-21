export * from './utils/date';
export * from './utils/colors';
export * from './utils/dom';
export * from './utils/format';
export * from './utils/scroll';
export * from './utils/event';



// others utils
export function openURL(url: string): void;
export function debounce(fn: Function, wait?: Number, immediate?: boolean) : Function
export function extend(...args: any[]): any;
export function throttle(fn: Function, limit: Number): Function; 
export function uid(): string;



// export interface NotifyAction {
//   label: string;
//   icon?: string;
//   noDismiss?: boolean;
//   handler: Function;
// }

// export interface NotifyOptions {
// message: string;
// timeout?: number;
// type?: string;
// color?: string;
// textColor?: string;
// icon?: string;
// avitar?: string;
// detail?: string;
// position?: string; 
// closeBtn?: boolean;
// actions?: NotifyAction[];
// onDismiss?: Function;
// }
// export namespace Notify{
// function create(message: string | NotifyOptions): void;
// }