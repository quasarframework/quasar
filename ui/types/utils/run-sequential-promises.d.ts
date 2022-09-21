export interface RunSequentialPromisesFulfilledResult<
  TKey extends number | string,
  TValue
> {
  key: TKey;
  status: "fulfilled";
  value: TValue;
}

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
   * When using http requests, be aware of the maximum threads that
   * the hosting browser supports (usually 3). Any number of threads
   * above that won't add any real benefits.
   *
   * @default 1
   */
  threadsNumber?: number;

  /**
   * The Promise is never rejected (no catch() needed)
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
