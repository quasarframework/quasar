import { h } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML = '<circle cx="50" cy="50" r="44" fill="none" stroke-width="4" stroke-opacity=".5" stroke="currentColor"></circle><circle cx="8" cy="54" r="6" fill="currentColor" stroke-width="3" stroke="currentColor"><animateTransform attributeName="transform" type="rotate" from="0 50 48" to="360 50 52" dur="2s" repeatCount="indefinite"></animateTransform></circle>'

export default createComponent({
  name: 'QSpinnerOrbit',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)
    return () => h('svg', {
      class: classes.value,
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 100 100',
      preserveAspectRatio: 'xMidYMid',
      xmlns: 'http://www.w3.org/2000/svg',
      innerHTML
    })
  }
})
