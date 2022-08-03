interface BootConfigurationItem {
  path: string;
  server?: false;
  client?: false;
}

export type QuasarBootConfiguration = (string | BootConfigurationItem)[];
