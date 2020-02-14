import "quasar";

interface BootConfigurationItem {
  path: string;
  server?: false;
  client?: false;
}

declare module "quasar" {  
  type QuasarBootConfiguration = (string | BootConfigurationItem)[];
}
