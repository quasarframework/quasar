import { computed, reactive, isRef, watchEffect, toRefs } from 'vue'
import { isCssColor } from '../../utils/colors'

export function destructComputed (getter) {
  const refs = reactive({})
  const base = computed(getter)
  watchEffect(() => {
    for (const key in base.value) {
      refs[ key ] = base.value[ key ]
    }
  }, { flush: 'sync' })
  return toRefs(refs)
}

export function useColor (colors) {
  return destructComputed(() => {
    const classes = []
    const styles = {}

    if (colors.value.background) {
      if (isCssColor(colors.value.background)) {
        styles.backgroundColor = colors.value.background
      }
      else {
        classes.push(`bg-${ colors.value.background }`)
      }
    }

    if (colors.value.text) {
      if (isCssColor(colors.value.text)) {
        styles.color = colors.value.text
        styles.caretColor = colors.value.text
      }
      else {
        classes.push(`text-${ colors.value.text }`)
      }
    }

    return { colorClasses: classes, colorStyles: styles }
  })
}

export function useTextColor (props, name) {
  const colors = computed(() => ({
    text: isRef(props) ? props.value : (name ? props[ name ] : null)
  }))

  const {
    colorClasses: textColorClasses,
    colorStyles: textColorStyles
  } = useColor(colors)

  return { textColorClasses, textColorStyles }
}

export function useBackgroundColor (props, name) {
  const colors = computed(() => ({
    background: isRef(props) ? props.value : (name ? props[ name ] : null)
  }))

  const {
    colorClasses: backgroundColorClasses,
    colorStyles: backgroundColorStyles
  } = useColor(colors)

  return { backgroundColorClasses, backgroundColorStyles }
}
