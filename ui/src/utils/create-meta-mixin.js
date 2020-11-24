import { clientList, planClientUpdate } from '../plugins/Meta.js'

export default metaOptions => {
  if (__QUASAR_SSR_SERVER__) {
    return {
      created: typeof metaOptions === 'function'
        ? function () {
            this.ssrContext.__qMetaList.push(
              metaOptions.call(this) || {}
            )
          }
        : function () {
          this.ssrContext.__qMetaList.push(metaOptions)
        }
    }
  }

  const mixin = {
    activated () {
      this.__qMeta.active = true
      planClientUpdate()
    },

    deactivated () {
      this.__qMeta.active = false
      planClientUpdate()
    },

    unmounted () {
      clientList.splice(clientList.indexOf(this.__qMeta), 1)
      planClientUpdate()
      this.__qMeta = void 0
    }
  }

  if (typeof metaOptions === 'function') {
    Object.assign(mixin, {
      computed: {
        __qMetaOptions () {
          return metaOptions.call(this) || {}
        }
      },

      watch: {
        __qMetaOptions (val) {
          this.__qMeta.val = val
          this.__qMeta.active === true && planClientUpdate()
        }
      },

      created () {
        this.__qMeta = { active: true, val: this.__qMetaOptions }
        clientList.push(this.__qMeta)
        planClientUpdate()
      }
    })
  }
  else {
    mixin.created = function () {
      this.__qMeta = { active: true, val: metaOptions }
      clientList.push(this.__qMeta)
      planClientUpdate()
    }
  }

  return mixin
}
