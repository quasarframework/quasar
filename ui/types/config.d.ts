interface NativeMobileWrapperConfiguration {
  iosStatusBarPadding?: boolean;
  androidStatusBarPadding?: boolean;
  backButton?: boolean;
  backButtonExit?: boolean | "*" | string[];
}

export interface QuasarUIConfiguration {
  // These don't fit the API structure (no owning plugin/component), so they don't have API definitions
  capacitor?: NativeMobileWrapperConfiguration;
  cordova?: NativeMobileWrapperConfiguration;

  /**
   * The nodes Quasar appends to <body> to render portals (QDialog, QMenu,
   * QTooltip, ...) and the Notify, Loading and LoadingBar plugins into.
   */
  globalNodes?: {
    /**
     * CSS class(es) applied to every global node; use as an ancestor
     * selector to style what Quasar renders outside your app's root element
     */
    class?: string;
  };

  // The rest will be augmented by auto-generated code
}
