// These wrappers are in a standalone file and not into main module to avoid
//  executing side-effects when requiring them into a file which will be evaluated by Node
// (in this case, `configure` into `quasar.conf.js`), side-effects which would be triggered
//  when doing `const { configure } = require('quasar')`.
// This is a precautional measure to avoid future bugs.
// Since at build time 'quasar' modules doesn't exist yet,
//  but it will after the pavkage has been built, we ignore the error use @ts-ignore
// If this condition changes, this file must be updated accordingly.
declare module "quasar/wrappers" {
  // @ts-ignore
  import { BootCallback, ConfigureCallback } from "quasar";
  
  function boot<TStore = any>(callback: BootCallback<TStore>): BootCallback<TStore>;
  function configure(callback: ConfigureCallback): ConfigureCallback;
}
