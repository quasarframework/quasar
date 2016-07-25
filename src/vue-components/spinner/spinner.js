import audio from './svg-spinners/audio.svg'
import ball from './svg-spinners/ball.svg'
import bars from './svg-spinners/bars.svg'
import circles from './svg-spinners/circles.svg'
import dots from './svg-spinners/dots.svg'
import facebook from './svg-spinners/facebook.svg'
import gears from './svg-spinners/gears.svg'
import grid from './svg-spinners/grid.svg'
import hearts from './svg-spinners/hearts.svg'
import hourglass from './svg-spinners/hourglass.svg'
import infinity from './svg-spinners/infinity.svg'
import ios from './svg-spinners/ios.svg'
import oval from './svg-spinners/oval.svg'
import pie from './svg-spinners/pie.svg'
import puff from './svg-spinners/puff.svg'
import radio from './svg-spinners/radio.svg'
import rings from './svg-spinners/rings.svg'
import tail from './svg-spinners/tail.svg'

import { current as theme } from '../../theme'

let templates = {
  audio, ball, bars, circles, dots, facebook, gears, grid, hearts,
  hourglass, infinity, ios, oval, pie, puff, radio, rings, tail
}

export default (_Vue) => {
  Object.keys(templates).forEach((spinner) => {
    _Vue.partial('quasar-partial-' + spinner, templates[spinner])
  })

  _Vue.component('spinner', {
    template: '<span><partial :name="partialName"></partial></span>',
    props: {
      name: {
        type: String,
        default: theme === 'ios' ? 'ios' : 'tail'
      },
      size: {
        type: Number,
        default: 64
      },
      color: {
        type: String,
        default: '#000'
      }
    },
    computed: {
      partialName () {
        return 'quasar-partial-' + this.name
      }
    }
  })
}
