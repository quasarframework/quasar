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