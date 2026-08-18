import { acceptHMRUpdate, defineStore } from "pinia";

export const useExampleStore = defineStore("example", {
  state: () => ({
    // asserted by the e2e suites — keep in sync with
    // /app-vite/test/playground-suite.js > fixtureMarkers
    greeting: "Greetings from Pinia",
    // a Map only survives SSR/SSG state serialization when it is not
    // JSON-stringified (#11382); serialized form pinned in fixtureMarkers
    flags: new Map([["ssr", "map-survives-serialization"]])
  })
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExampleStore, import.meta.hot));
}
