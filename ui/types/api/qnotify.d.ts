// Error on "quasar" import shown in IDE is normal, as we only have Components/Directives/Plugins types after the build step
// The import will work correctly at runtime
import { QNotifyCreateOptions } from "quasar";

export type QNotifyUpdateOptions = Omit<QNotifyCreateOptions, 'group' | 'position'>;
export type QNotifyOptions = Omit<QNotifyCreateOptions, 'ignoreDefaults'>;
