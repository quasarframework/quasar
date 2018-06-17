import { ssrInject } from './install'
import { ssrUpdateBody } from './body'
import { ssrUpdateLang } from './i18n'
import { ssrGetPlatform, ssrClientTakeover } from './plugins/platform'
import { ssrGetCookies } from './plugins/cookies'

const clientAppMixin = {
  mounted () {
    ssrClientTakeover()
  }
}

export default function (ctx) {
  if (ctx.ssr) {
    ctx.app.$q = Object.assign({
      platform: ssrGetPlatform(ctx),
      cookies: ssrGetCookies(ctx)
    }, ssrInject)

    ssrUpdateBody(ctx)
    ssrUpdateLang(ctx)

    return
  }

  ctx.app.mixins = ctx.app.mixins || []
  if (!ctx.app.mixins.includes(clientAppMixin)) {
    ctx.app.mixins.push(clientAppMixin)
  }
}
