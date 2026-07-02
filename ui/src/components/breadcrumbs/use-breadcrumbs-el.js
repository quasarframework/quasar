import useRouterLink, {
  useRouterLinkProps
} from '../../composables/private.use-router-link/use-router-link.js'

export const useBreadcrumbsElProps = {
  ...useRouterLinkProps,

  /**
   * The label text for the breadcrumb
   *
   * @api prop label
   * @type {String}
   * @category content
   * @example 'Home'
   * @example 'Index'
   */
  label: String,

  /**
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)
   *
   * @api prop icon
   * @type {String}
   * @category content
   * @example 'map'
   * @example 'ion-add'
   * @example 'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'
   * @example 'img:path/to/some_image.png'
   */
  icon: String,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'span'
   * @category content
   * @optional
   * @example 'div'
   * @example 'span'
   */
  tag: {
    type: String,
    default: 'span'
  }
}

export const useBreadcrumbsElEmits = ['click']

export default function useBreadcrumbsEl() {
  return useRouterLink()
}
