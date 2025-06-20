import { Server } from "node:http";
import { Application, Request, Response } from "express";

/**
 * This interface can be augmented by users to inject their own server types.
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
export interface SsrDriverTypes {
  app: unknown extends SsrDriver["app"] ? Application : SsrDriver["app"];
  listenResult: unknown extends SsrDriver["listenResult"] ? Server : SsrDriver["listenResult"];
  request: unknown extends SsrDriver["request"] ? Request : SsrDriver["request"];
  response: unknown extends SsrDriver["response"] ? Response : SsrDriver["response"];
}
