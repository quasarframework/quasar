import { $q, queues } from './install.js'

const mixin = {
  mounted () {
    queues.takeover.forEach(run => {
      run(this.$q)
    })
  }
}

export default function (ctx) {
  if (ctx.ssr) {
    const q = {
      ...$q,
      ssrContext: ctx.ssr
    }

    Object.assign(ctx.ssr, {
      Q_HEAD_TAGS: '',
      Q_BODY_ATTRS: '',
      Q_BODY_TAGS: ''
    })

    ctx.app.$q = ctx.ssr.$q = q

    queues.server.forEach(run => {
      run(q, ctx)
    })
  }
  else {
    const mixins = ctx.app.mixins || []
    if (mixins.includes(mixin) === false) {
      ctx.app.mixins = mixins.concat(mixin)
    }
  }
}
