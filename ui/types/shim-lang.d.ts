declare module "quasar/lang/*" {
  // We know "quasar" will exists at runtime, we can safely ignore the TS error
  // @ts-ignore
  import { QuasarLanguage } from "quasar";
  const lang: QuasarLanguage;
  export default lang;
}
