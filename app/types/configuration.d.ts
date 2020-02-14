import { QuasarContext, QuasarConf } from "quasar";
import "./configuration/conf";
import "./configuration/context";

declare module "quasar" {
  type ConfigureCallback = (context: QuasarContext) => QuasarConf;
}
