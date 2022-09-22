export interface RunSequentialPromisesFulfilledResult<
  TKey extends number | string,
  TValue
> {
  key: TKey;
  status: "fulfilled";
  value: TValue;
}

/**
 * When using `runSequentialPromises` without `abortOnFail: false`, the Promise will reject with this type.
 * You can use this type to strongly-type the result yourself as it can't be automatically inferred.
 *
 * @example
 * runSequentialPromises([
 *   () => Promise.resolve('value1'),
 *   () => Promise.reject(new Error('test')),
 *   () => Promise.resolve('value2'),
 * ])
 * // First generic param is `number` because we are using array-style
 * // Second generic param is `string` because we are resolving with string values
 * .catch((errResult: RunSequentialPromisesRejectedResult<number, string>) => {
 *   // ...
 *   errResult.reason // `any` because you can reject with anything, you can cast it as you wish
 * })
 */
export interface RunSequentialPromisesRejectedResult<
  TKey extends number | string,
  TValue
> {
  key: TKey;
  status: "rejected";
  reason: any;
  resultAggregator: TKey extends number
    ? RunSequentialPromisesResult<TKey, TValue>[]
    : { [key in TKey]?: RunSequentialPromisesResult<TKey, TValue> };
}

export type RunSequentialPromisesResult<TKey extends number | string, TValue> =
  | RunSequentialPromisesFulfilledResult<TKey, TValue>
  | RunSequentialPromisesRejectedResult<TKey, TValue>;

export interface RunSequentialPromisesOptions {
  /**
   * When making HTTP requests, be aware of the maximum threads that
   * the hosting browser supports (usually 5). Any number of threads
   * above that won't add any real benefits.
   *
   * @default 1
   */
  threadsNumber?: number;

  /**
   * When set to `false`, the result Promise will never get rejected (no catch() needed)
   * Otherwise, if one of the sequential Promises gets rejected, the Promise will be
   * rejected with {@link RunSequentialPromisesRejectedResult}
   *
   * @default true
   */
  abortOnFail?: boolean;
}

/**
 * Run a list of Promises sequentially, optionally on multiple threads.
 *
 * @see https://quasar.dev/quasar-utils/other-utils#runsequentialpromises
 *
 * @throws {RunSequentialPromisesRejectedResult} when a Promise rejects (when `options.abortOnFail` is not false)
 */
// Array-style overrides
export function runSequentialPromises<
  TValue = any,
  TKey extends number = number
>(
  promises: ((
    resultAggregator: RunSequentialPromisesResult<TKey, TValue>[]
  ) => Promise<TValue>)[],
  options: Omit<RunSequentialPromisesOptions, "abortOnFail"> & {
    abortOnFail: false;
  }
): Promise<RunSequentialPromisesResult<TKey, TValue>[]>;
export function runSequentialPromises<
  TValue = any,
  TKey extends number = number
>(
  promises: ((
    resultAggregator: RunSequentialPromisesFulfilledResult<TKey, TValue>[]
  ) => Promise<TValue>)[],
  options?: RunSequentialPromisesOptions
): Promise<RunSequentialPromisesFulfilledResult<TKey, TValue>[]>;
// Object-style overrides
export function runSequentialPromises<
  TValue = any,
  TKey extends string = string
>(
  promisesMap: {
    [key in TKey]: (resultAggregator: {
      [key in TKey]?: RunSequentialPromisesResult<TKey, TValue>;
    }) => Promise<TValue>;
  },
  options?: Omit<RunSequentialPromisesOptions, "abortOnFail"> & {
    abortOnFail: false;
  }
): Promise<{
  [key in TKey]: RunSequentialPromisesResult<TKey, TValue>;
}>;
export function runSequentialPromises<
  TValue = any,
  TKey extends string = string
>(
  promisesMap: {
    [key in TKey]: (resultAggregator: {
      [key in TKey]?: RunSequentialPromisesFulfilledResult<TKey, TValue>;
    }) => Promise<TValue>;
  },
  options?: RunSequentialPromisesOptions
): Promise<{
  [key in TKey]: RunSequentialPromisesFulfilledResult<TKey, TValue>;
}>;
