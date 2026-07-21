interface NativeMobileWrapperConfiguration {
  iosStatusBarPadding?: boolean;
  backButton?: boolean;
  backButtonExit?: boolean | "*" | string[];
}

export interface QuasarUIConfiguration {
  // These two are oddly structured and doesn't fit the API structure, so they don't have API definitions
  capacitor?: NativeMobileWrapperConfiguration;
  cordova?: NativeMobileWrapperConfiguration;

  /**
   * Target for Quasar-managed teleported content. A selector is required when
   * configuring this through quasar.config; runtime plugin configuration may
   * also provide an Element, ShadowRoot, or resolver function.
   */
  teleportTarget?:
    | string
    | Element
    | ShadowRoot
    | (() => Element | ShadowRoot | undefined);

  // The rest will be augmented by auto-generated code
}
