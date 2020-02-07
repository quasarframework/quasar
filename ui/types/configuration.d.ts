import { QuasarConf } from "./configuration/conf";
import { QuasarContext } from "./configuration/context";

export * from "./configuration/conf";
export * from "./configuration/context";

export type ConfigureCallback = (context: QuasarContext) => QuasarConf;
