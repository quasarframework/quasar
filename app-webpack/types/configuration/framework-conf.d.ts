import {
  QuasarComponents,
  QuasarDirectives,
  QuasarIconSets,
  QuasarLanguageCodes,
  QuasarPlugins,
  QuasarUIConfiguration,
} from "quasar";

type AnyFn = (...args: any) => any;
type SerializableConfiguration<T> = {
  [K in keyof T as AnyFn extends T[K] ? never : K]: object extends T[K]
    ? SerializableConfiguration<T[K]>
    : T[K];
};

interface QuasarFrameworkConfiguration {
  /**
   * @see - QuasarConfOptions tab in API cards throughout the docs
   */
  config?: SerializableConfiguration<QuasarUIConfiguration>;
  /**
   * One of the Quasar IconSets
   *
   * @see https://v2.quasar.dev/options/quasar-icon-sets
   *
   * @example 'material-icons'
   */
  iconSet?: QuasarIconSets;
  /**
   * One of the Quasar language packs
   *
   * @see https://v2.quasar.dev/options/quasar-language-packs
   *
   * @example 'en-US'
   * @example 'es'
   */
  lang?: QuasarLanguageCodes;
  /**
   * Quasar CSS addons have breakpoint aware versions of flex and spacing classes
   *
   * @see https://quasar.dev/layout/grid/introduction-to-flexbox#flex-addons
   * @see https://quasar.dev/style/spacing#flex-addons
   */
  cssAddon?: boolean;

  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   *
   * @default 'kebab'
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";

  /**
   * Quasar will auto import components based on your usage.
   * But, in case you have a special case, you can manually specify Quasar components to be available everywhere.
   *
   * An example case would be having custom component definitions with plain string templates, inside .js or .ts files,
   * in which you are using Quasar components (e.g. q-avatar).
   *
   * Another example would be that dynamically rendering components depending on an API response or similar (e.g. in a CMS),
   * something like `<component :is="dynamicName">` where `dynamicName` is a string that matches a Quasar component name.
   *
   * @example ['QAvatar', 'QChip']
   */
  components?: (keyof QuasarComponents)[];
  /**
   * Quasar will auto import directives based on your usage.
   * But, in case you have a special case, you can manually specify Quasar directives to be available everywhere.
   *
   * An example case would be having custom component definitions with plain string templates, inside .js or .ts files,
   * in which you are using Quasar directives (e.g. v-intersection).
   *
   * @example ['Intersection', 'Mutation']
   */
  directives?: (keyof QuasarDirectives)[];
  /**
   * Quasar plugins to be installed. Specify the ones you are using in your app.
   *
   * @example ['Notify', 'Loading', 'Meta', 'AppFullscreen']
   */
  plugins?: (keyof QuasarPlugins)[];
}
