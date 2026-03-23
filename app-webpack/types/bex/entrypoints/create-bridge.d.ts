import { BexBridge, BexBridgeOptions } from "../bridge";

/**
 * Creates a new bridge instance to be used in the script.
 * The bridge can be used for communication between different scripts.
 * Using a bridge is optional. If you don't need communication, you can ignore it.
 *
 * It is a singleton, so you can only call it once per script.
 * Calling it more than once will only log an error and won't return anything.
 *
 * @example
 * const bridge = createBridge();
 *
 * @example
 * const bridge = createBridge({ debug: true });
 */
export declare const createBridge: (
  options?: Pick<BexBridgeOptions, "debug">
) => BexBridge;
