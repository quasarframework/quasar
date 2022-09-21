export interface RunSequentialFulfilledResult<
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
  | RunSequentialFulfilledResult<TKey, TValue>
  | RunSequentialPromisesRejectedResult<TKey, TValue>;

export interface RunSequentialPromisesOptions {
  /**
   * When using http requests, be aware of the maximum threads that
   * the hosting browser supports (usually 3). Any number of threads
   * above that won't add any real benefits.
   *
   * @default 3
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
    resultAggregator: RunSequentialFulfilledResult<TKey, TValue>[]
  ) => Promise<TValue>)[],
  options?: RunSequentialPromisesOptions
): Promise<RunSequentialFulfilledResult<TKey, TValue>[]>;
// Object-style overrides
export function runSequentialPromises<
  TValue = any,
  TKey extends string = string
>(
  promisesMap: {
    [key in TKey]: (resultAggregator: {
      [key in TKey]?: RunSequentialFulfilledResult<TKey, TValue>;
    }) => Promise<TValue>;
  },
  options?: RunSequentialPromisesOptions
): Promise<{ [key in TKey]: RunSequentialFulfilledResult<TKey, TValue> }>;
export function runSequentialPromises<
  TValue = any,
  TKey extends string = string
>(
  promisesMap: {
    [key in TKey]: (resultAggregator: {
      [key in TKey]?: RunSequentialFulfilledResult<TKey, TValue>;
    }) => Promise<TValue>;
  },
  options?: Omit<RunSequentialPromisesOptions, "abortOnFail"> & {
    abortOnFail: false;
  }
): Promise<{ [key in TKey]: RunSequentialFulfilledResult<TKey, TValue> }>;
