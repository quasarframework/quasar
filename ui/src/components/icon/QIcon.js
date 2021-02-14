import { h, defineComponent, computed, getCurrentInstance } from 'vue'

import useSize, { useSizeProps } from '../../composables/private/use-size.js'

import { hSlot, hMergeSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QIcon',

  props: {
    ...useSizeProps,

    tag: {
      type: String,
      default: 'i'
    },

    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },

  setup (props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance()
    const sizeStyle = useSize(props)

    const classes = computed(() =>
      'q-icon'
      + (props.left === true ? ' on-left' : '')
      + (props.right === true ? ' on-right' : '')
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
    )

    const type = computed(() => {
      let cls
      let icon = props.name

      if (!icon) {
        return {
          none: true,
          cls: classes.value
        }
      }

      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon)
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon
          }
          else {
            return {
              cls: res.cls + ' ' + classes.value,
              content: res.content !== void 0
                ? res.content
                : ' '
            }
          }
        }
      }

      if (icon.startsWith('M') === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svg: true,
          cls: classes.value,
          nodes: def.split('&&').map(path => {
            const [ d, style, transform ] = path.split('@@')
            return h('path', {
              style,
              d,
              transform
            })
          }),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
      }

      if (icon.startsWith('img:') === true) {
        return {
          img: true,
          cls: classes.value,
          src: icon.substring(4)
        }
      }

      if (icon.startsWith('svguse:') === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svguse: true,
          cls: classes.value,
          src: def.substring(7),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
      }

      let content = ' '

      if (/^[l|f]a[s|r|l|b|d]{0,1} /.test(icon) || icon.startsWith('icon-') === true) {
        cls = icon
      }
      else if (icon.startsWith('bt-') === true) {
        cls = `bt ${ icon }`
      }
      else if (icon.startsWith('eva-') === true) {
        cls = `eva ${ icon }`
      }
      else if (/^ion-(md|ios|logo)/.test(icon) === true) {
        cls = `ionicons ${ icon }`
      }
      else if (icon.startsWith('ion-') === true) {
        cls = `ionicons ion-${ $q.platform.is.ios === true ? 'ios' : 'md' }${ icon.substr(3) }`
      }
      else if (icon.startsWith('mdi-') === true) {
        cls = `mdi ${ icon }`
      }
      else if (icon.startsWith('iconfont ') === true) {
        cls = `${ icon }`
      }
      else if (icon.startsWith('ti-') === true) {
        cls = `themify-icon ${ icon }`
      }
      else {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Icons ligature font
        //
        // Caution: To be able to add suffix to the class name,
        // keep the 'material-icons' at the end of the string.
        cls = 'notranslate material-icons'

        if (icon.startsWith('o_') === true) {
          icon = icon.substring(2)
          cls += '-outlined'
        }
        else if (icon.startsWith('r_') === true) {
          icon = icon.substring(2)
          cls += '-round'
        }
        else if (icon.startsWith('s_') === true) {
          icon = icon.substring(2)
          cls += '-sharp'
        }

        content = icon
      }

      return {
        cls: cls + ' ' + classes.value,
        content
      }
    })

    return () => {
      const data = {
        class: type.value.cls,
        style: sizeStyle.value,
        'aria-hidden': 'true',
        role: 'presentation'
      }

      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default))
      }

      if (type.value.img === true) {
        data.src = type.value.src
        return h('img', data)
      }

      if (type.value.svg === true) {
        data.viewBox = type.value.viewBox

        return h('svg', data, hMergeSlot(slots.default, type.value.nodes))
      }

      if (type.value.svguse === true) {
        data.viewBox = type.value.viewBox

        return h(
          'svg',
          data,
          hMergeSlot(slots.default, [ h('use', { 'xlink:href': type.value.src }) ])
        )
      }

      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]))
    }
  }
})
