import { ssrInject } from './install'
import { ssrUpdateBody } from './body'
import { ssrUpdateLang } from './i18n'
import { ssrGetPlatform } from './plugins/platform'
import { ssrGetCookies } from './plugins/cookies'

export default (ssr) => {
  ssr.app.$q = Object.assign({
    platform: ssrGetPlatform(ssr),
    cookies: ssrGetCookies(ssr)
  }, ssrInject)

  ssrUpdateBody(ssr)
  ssrUpdateLang(ssr)
}
