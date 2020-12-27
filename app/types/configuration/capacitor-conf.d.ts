export type QuasarCapacitorTargets = "android" | "ios";

export interface QuasarCapacitorConfiguration {
  /** If not present, will look for `package.json > capacitorId/cordovaId` */
  id?: string;
  /** If not present, will look for `package.json > name` */
  appName?: string;
  /** If not present, will look for `package.json > version` */
  version?: string;
  /** If not present, will look for `package.json > description` */
  description?: string;
}
