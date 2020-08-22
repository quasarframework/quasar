declare module "quasar/icon-set/*" {
  // We know "quasar" will exists at runtime, we can safely ignore the TS error
  // @ts-ignore
  import { QuasarIconSet } from "./extras/icon-set";
  const iconSet: QuasarIconSet;
  export default iconSet;
}
