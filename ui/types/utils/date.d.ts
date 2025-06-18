interface DateOptions {
  milliseconds?: number;
  millisecond?: number;
  seconds?: number;
  second?: number;
  minutes?: number;
  minute?: number;
  hours?: number;
  hour?: number;
  days?: number;
  day?: number;
  date?: number;
  months?: number;
  month?: number;
  year?: number;
  years?: number;
}

export interface DateLocale {
  days?: string[];
  daysShort?: string[];
  months?: string[];
  monthsShort?: string[];
}

export type DateUnitOptions =
  | "second"
  | "seconds"
  | "minute"
  | "minutes"
  | "hour"
  | "hours"
  | "day"
  | "days"
  | "date"
  | "month"
  | "months"
  | "year"
  | "years";

export type DateInput = Date | number | string;

export namespace date {
  function isValid(date: number | string): boolean;

  function extractDate(str: string, mask: string, locale?: DateLocale): Date;

  function buildDate(options: DateOptions, utc?: boolean): Date;

  function getDayOfWeek(date: Date): number;

  function getWeekOfYear(date: DateInput): number;

  function isBetweenDates(
    date: DateInput,
    from: DateInput,
    to: DateInput,
    opts?: { inclusiveFrom: boolean; inclusiveTo: boolean; onlyDate: boolean },
  ): boolean;

  function addToDate(date: DateInput, options: DateOptions): Date;

  function subtractFromDate(date: DateInput, options: DateOptions): Date;

  function adjustDate(
    date: DateInput,
    options: DateOptions,
    utc?: boolean,
  ): Date;

  function startOfDate(
    date: DateInput,
    option: DateUnitOptions,
    utc?: boolean,
  ): Date;

  function endOfDate(
    date: DateInput,
    option: DateUnitOptions,
    utc?: boolean,
  ): Date;

  function getMaxDate(...args: DateInput[]): Date;

  function getMinDate(...args: DateInput[]): Date;

  function getDateDiff(
    date: DateInput,
    subtract: DateInput,
    unit?: `${DateUnitOptions}s`,
  ): number;

  function getDayOfYear(date: DateInput): number;

  function inferDateFormat(date: DateInput): "date" | "number" | "string";

  function getDateBetween(
    date: DateInput,
    min?: DateInput,
    max?: DateInput,
  ): Date;

  function isSameDate(
    date: DateInput,
    date2: DateInput,
    unit?: DateUnitOptions,
  ): boolean;

  function daysInMonth(date: DateInput): number;

  function formatDate(
    date: DateInput | undefined,
    format?: string,
    locale?: DateLocale,
    __forcedYear?: number,
    __forcedTimezoneOffset?: number,
  ): string;

  function clone<D extends DateInput>(date: D): D;
}
