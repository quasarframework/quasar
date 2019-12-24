import { QuasarConf } from "./configuration/conf";
import { QuasarContext } from "./configuration/context";

export * from "./configuration/conf";
export * from "./configuration/context";

type ConfigureCallback = (context: QuasarContext) => QuasarConf;

export function configure(callback: ConfigureCallback): ConfigureCallback;
