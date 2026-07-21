interface NativeMobileWrapperConfiguration {
  iosStatusBarPadding?: boolean;
  backButton?: boolean;
  backButtonExit?: boolean | "*" | string[];
}

export interface QuasarUIConfiguration {
  // These two are oddly structured and doesn't fit the API structure, so they don't have API definitions
  capacitor?: NativeMobileWrapperConfiguration;
  cordova?: NativeMobileWrapperConfiguration;

  // The rest will be augmented by auto-generated code
}
