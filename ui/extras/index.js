import Bubble from "./directives/bubble";

// Elements
import WLogotype from "./components/elements/logotype/WLogotype";
import WStepper from "./components/elements/stepper/WStepper";

// Patterns
import WActionCard from "./components/patterns/card/WActionCard";
import WCollapsible from "./components/patterns/collapsible/WCollapsible";
import WInfoCard from "./components/patterns/card/WInfoCard";
import WDialog from "./components/patterns/dialog/WDialog";
import WLayout from "./components/patterns/layout/WLayout";
import WPage from "./components/patterns/page/WPage";
import WSidebar from "./components/patterns/sidebar/WSidebar";

// Templates
import WListTemplate from "./components/templates/list-template/WListTemplate";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  Vue.directive("bubble", Bubble);

  // Elements
  Vue.component("WLogotype", WLogotype);
  Vue.component("WStepper", WStepper);

  // Patterns
  Vue.component("WActionCard", WActionCard);
  Vue.component("WInfoCard", WInfoCard);
  Vue.component("WCollapsible", WCollapsible);
  Vue.component("WDialog", WDialog);
  Vue.component("WLayout", WLayout);
  Vue.component("WPage", WPage);
  Vue.component("WSidebar", WSidebar);

  // Templates
  Vue.component("WListTemplate", WListTemplate);
}

// Create module definitionА for Vue.use()
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default plugin;
