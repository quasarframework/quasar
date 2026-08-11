import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * This interface MUST be augmented by users to inject their own server types.
 *
 * @example
 * declare module '#q-app' {
 *   interface SsrDriver {
 *     app: Application;
 *     listenResult: Server;
 *     request: Request;
 *     response: Response;
 *   }
 * }
 */
export interface SsrDriver extends Record<string, unknown> {}

/**
 * @private
 */
type Fallback<T, Default> = unknown extends T ? Default : T;

/**
 * @private
 */
export interface SsrDriverTypes {
  app: SsrDriver["app"];
  listenResult: SsrDriver["listenResult"];
  request: Fallback<SsrDriver["request"], IncomingMessage>;
  response: Fallback<SsrDriver["response"], ServerResponse>;
}
