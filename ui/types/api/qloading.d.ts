// Error on "quasar" import shown in IDE is normal, as we only have Components/Directives/Plugins types after the build step
// The import will work correctly at runtime
import { QLoadingShowOptions } from "quasar";

export type QLoadingUpdateOptions = Omit<QLoadingShowOptions, 'group'>;
