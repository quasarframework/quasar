export interface QuasarMobileConfiguration {
  /** Manually specify Android Studio bin path, in case Quasar isn't able to locate it on your system */
  bin?: {
    linuxAndroidStudio?: string;
    windowsAndroidStudio?: string;
  }
}
