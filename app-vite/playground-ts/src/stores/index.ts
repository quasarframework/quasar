import { defineStore } from "#q-app";
import { createPinia } from "pinia";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
