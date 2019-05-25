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
    const q = { ...$q }

    Object.assign(ctx.ssr, {
      Q_HEAD_TAGS: '',
      Q_BODY_ATTRS: '',
      Q_BODY_TAGS: ''
    })

    queues.server.forEach(run => {
      run(q, ctx)
    })

    ctx.app.$q = q
  }
  else {
    const mixins = ctx.app.mixins || []
    if (!mixins.includes(mixin)) {
      ctx.app.mixins = mixins.concat(mixin)
    }
  }
}
