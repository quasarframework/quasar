import { acceptHMRUpdate, defineStore } from "pinia";

export const useExampleStore = defineStore("example", {
  state: () => ({
    // asserted by the e2e suites — keep in sync with
    // /app-vite/test/playground-suite.js > fixtureMarkers
    greeting: "Greetings from Pinia"
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExampleStore, import.meta.hot));
}
