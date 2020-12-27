declare module "quasar/icon-set/*" {
  // We know "quasar" will exists at runtime, we can safely ignore the TS error
  // @ts-ignore
  import { QuasarIconSet } from "quasar";
  const iconSet: QuasarIconSet;
  export default iconSet;
}
