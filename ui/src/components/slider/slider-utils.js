import TouchPan from '../../directives/TouchPan.js'

import DarkMixin from '../../mixins/dark.js'
import FormMixin from '../../mixins/form.js'

import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import { isNumber, isObject } from '../../utils/is.js'

const markerPrefixClass = 'q-slider__marker-labels'
const defaultMarkerConvertFn = v => ({ value: v })

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [ 34, 37, 40, 33, 39, 38 ]

export const SliderMixin = {
  mixins: [ DarkMixin, FormMixin ],

  directives: {
    TouchPan
  },

  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    innerMin: Number,
    innerMax: Number,

    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    snap: Boolean,

    vertical: Boolean,
    reverse: Boolean,

    hideSelection: Boolean,

    color: String,
    markerLabelsClass: String,

    label: Boolean,
    labelColor: String,
    labelTextColor: String,
    labelAlways: Boolean,
    switchLabelSide: Boolean,

    markers: [ Boolean, Number ],
    markerLabels: [ Boolean, Array, Object, Function ],
    switchMarkerLabelsSide: Boolean,

    trackImg: String,
    trackColor: String,
    innerTrackImg: String,
    innerTrackColor: String,
    selectionColor: String,
    selectionImg: String,

    thumbSize: {
      type: String,
      default: '20px'
    },
    trackSize: {
      type: String,
      default: '4px'
    },

    disable: Boolean,
    readonly: Boolean,
    dense: Boolean,

    tabindex: [ String, Number ],

    thumbColor: String,
    thumbPath: {
      type: String,
      default: 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
    }
  },

  data () {
    return {
      active: false,
      preventFocus: false,
      focus: false,
      dragging: false
    }
  },

  computed: {
    axis () {
      return this.vertical === true ? '--v' : '--h'
    },

    labelSide () {
      return '-' + (this.switchLabelSide === true ? 'switched' : 'standard')
    },

    isReversed () {
      return this.vertical === true
        ? this.reverse === true
        : this.reverse !== (this.$q.lang.rtl === true)
    },

    computedInnerMin () {
      return this.__getInnerMin(this.innerMin)
    },

    computedInnerMax () {
      return this.__getInnerMax(this.innerMax)
    },

    editable () {
      return this.disable !== true && this.readonly !== true &&
        this.computedInnerMin < this.computedInnerMax
    },

    computedDecimals () {
      return (String(this.step).trim('0').split('.')[ 1 ] || '').length
    },

    computedStep () {
      return this.step === 0 ? 1 : this.step
    },

    computedTabindex () {
      return this.editable === true ? this.tabindex || 0 : -1
    },

    trackLen () {
      return this.max - this.min
    },

    innerBarLen () {
      return this.computedInnerMax - this.computedInnerMin
    },

    innerMinRatio () {
      return this.__convertModelToRatio(this.computedInnerMin)
    },

    innerMaxRatio () {
      return this.__convertModelToRatio(this.computedInnerMax)
    },

    positionProp () {
      return this.vertical === true
        ? (this.isReversed === true ? 'bottom' : 'top')
        : (this.isReversed === true ? 'right' : 'left')
    },

    sizeProp () {
      return this.vertical === true ? 'height' : 'width'
    },

    thicknessProp () {
      return this.vertical === true ? 'width' : 'height'
    },

    orientation () {
      return this.vertical === true ? 'vertical' : 'horizontal'
    },

    attributes () {
      const acc = {
        role: 'slider',
        'aria-valuemin': this.computedInnerMin,
        'aria-valuemax': this.computedInnerMax,
        'aria-orientation': this.orientation,
        'data-step': this.step
      }

      if (this.disable === true) {
        acc[ 'aria-disabled' ] = 'true'
      }
      else if (this.readonly === true) {
        acc[ 'aria-readonly' ] = 'true'
      }

      return acc
    },

    classes () {
      return `q-slider q-slider${this.axis} q-slider--${this.active === true ? '' : 'in'}active inline no-wrap ` +
        (this.vertical === true ? 'row' : 'column') +
        (this.disable === true ? ' disabled' : ' q-slider--enabled' + (this.editable === true ? ' q-slider--editable' : '')) +
        (this.focus === 'both' ? ' q-slider--focus' : '') +
        (this.label || this.labelAlways === true ? ' q-slider--label' : '') +
        (this.labelAlways === true ? ' q-slider--label-always' : '') +
        (this.isDark === true ? ' q-slider--dark' : '') +
        (this.dense === true ? ' q-slider--dense q-slider--dense' + this.axis : '')
    },

    selectionBarClass () {
      const color = this.selectionColor || this.color
      return 'q-slider__selection absolute' +
        (color !== void 0 ? ` text-${color}` : '')
    },

    markerClass () {
      return this.__getAxisClass('markers') + ' absolute overflow-hidden'
    },
    trackContainerClass () {
      return this.__getAxisClass('track-container')
    },
    pinClass () {
      return this.__getPositionClass('pin')
    },
    labelClass () {
      return this.__getPositionClass('label')
    },
    textContainerClass () {
      return this.__getPositionClass('text-container')
    },
    markerLabelsContainerClass () {
      return this.__getPositionClass('marker-labels-container') +
        (this.markerLabelsClass !== void 0 ? ` ${this.markerLabelsClass}` : '')
    },

    trackClass () {
      return 'q-slider__track relative-position no-outline' +
        (this.trackColor !== void 0 ? ` bg-${this.trackColor}` : '')
    },
    trackStyle () {
      const acc = { [ this.thicknessProp ]: this.trackSize }
      if (this.trackImg !== void 0) {
        acc.backgroundImage = `url(${this.trackImg}) !important`
      }
      return acc
    },

    innerBarClass () {
      return 'q-slider__inner absolute' +
        (this.innerTrackColor !== void 0 ? ` bg-${this.innerTrackColor}` : '')
    },

    innerBarStyle () {
      const acc = {
        [ this.positionProp ]: `${100 * this.innerMinRatio}%`,
        [ this.sizeProp ]: `${100 * (this.innerMaxRatio - this.innerMinRatio)}%`
      }
      if (this.innerTrackImg !== void 0) {
        acc.backgroundImage = `url(${this.innerTrackImg}) !important`
      }
      return acc
    },

    markerStep () {
      return isNumber(this.markers) === true ? this.markers : this.computedStep
    },

    markerTicks () {
      const acc = []
      const step = this.markerStep

      let value = this.min
      do {
        acc.push(value)
        value += step
      } while (value < this.max)

      acc.push(this.max)
      return acc
    },

    markerLabelClass () {
      const prefix = ` ${markerPrefixClass}${this.axis}-`
      return markerPrefixClass +
        `${prefix}${this.switchMarkerLabelsSide === true ? 'switched' : 'standard'}` +
        `${prefix}${this.isReversed === true ? 'rtl' : 'ltr'}`
    },

    markerLabelsList () {
      if (this.markerLabels === false) { return null }

      return this.__getMarkerList(this.markerLabels).map((entry, index) => ({
        index,
        value: entry.value,
        label: entry.label || entry.value,
        classes: this.markerLabelClass +
          (entry.classes !== void 0 ? ' ' + entry.classes : ''),
        style: {
          ...this.__getMarkerLabelStyle(entry.value),
          ...(entry.style || {})
        }
      }))
    },

    markerScope () {
      return {
        markerList: this.markerLabelsList,
        markerMap: this.markerLabelsMap,
        classes: this.markerLabelClass,
        getStyle: this.__getMarkerLabelStyle
      }
    },

    markerStyle () {
      if (this.innerBarLen !== 0) {
        const size = 100 * this.markerStep / this.innerBarLen

        return {
          ...this.innerBarStyle,
          backgroundSize: this.vertical === true
            ? `2px ${size}%`
            : `${size}% 2px`
        }
      }

      return null
    },

    markerLabelsMap () {
      if (this.markerLabels === false) { return null }

      const acc = {}
      this.markerLabelsList.forEach(entry => {
        acc[ entry.value ] = entry
      })
      return acc
    },

    panDirectives () {
      return this.editable === true
        ? [{
          name: 'touch-pan',
          value: this.__onPan,
          modifiers: {
            [ this.orientation ]: true,
            prevent: true,
            stop: true,
            mouse: true,
            mouseAllDir: true
          }
        }]
        : null
    }
  },

  methods: {
    __getInnerMin (val) {
      return isNaN(val) === true || this.innerMin < this.min
        ? this.min
        : this.innerMin
    },

    __getInnerMax (val) {
      return isNaN(val) === true || val > this.max
        ? this.max
        : this.innerMax
    },

    __getPositionClass (name) {
      const cls = 'q-slider__' + name
      return `${cls} ${cls}${this.axis} ${cls}${this.axis}${this.labelSide}`
    },

    __getAxisClass (name) {
      const cls = 'q-slider__' + name
      return `${cls} ${cls}${this.axis}`
    },

    __convertRatioToModel (ratio) {
      let model = this.min + ratio * (this.max - this.min)

      if (this.step > 0) {
        const modulo = (model - this.min) % this.step
        model += (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0) - modulo
      }

      if (this.computedDecimals > 0) {
        model = parseFloat(model.toFixed(this.computedDecimals))
      }

      return between(model, this.computedInnerMin, this.computedInnerMax)
    },

    __convertModelToRatio (model) {
      return this.trackLen === 0
        ? 0
        : (model - this.min) / this.trackLen
    },

    __getDraggingRatio (evt, dragging) {
      const
        pos = position(evt),
        val = this.vertical === true
          ? between((pos.top - dragging.top) / dragging.height, 0, 1)
          : between((pos.left - dragging.left) / dragging.width, 0, 1)

      return between(
        this.isReversed === true ? 1.0 - val : val,
        this.innerMinRatio,
        this.innerMaxRatio
      )
    },

    __getMarkerList (def) {
      if (def === false) { return null }

      if (def === true) {
        return this.markerTicks.map(defaultMarkerConvertFn)
      }

      if (typeof def === 'function') {
        return this.markerTicks.map(value => {
          const item = def(value)
          return isObject(item) === true ? { ...item, value } : { value, label: item }
        })
      }

      const filterFn = ({ value }) => value >= this.min && value <= this.max

      if (Array.isArray(def) === true) {
        return def
          .map(item => (isObject(item) === true ? item : { value: item }))
          .filter(filterFn)
      }

      return Object.keys(def).map(key => {
        const item = def[ key ]
        const value = Number(key)
        return isObject(item) === true ? { ...item, value } : { value, label: item }
      }).filter(filterFn)
    },

    __getMarkerLabelStyle (val) {
      return { [ this.positionProp ]: `${100 * (val - this.min) / this.trackLen}%` }
    },

    __getMarkerLabelsContent (h) {
      if (this.$scopedSlots[ 'marker-label-group' ] !== void 0) {
        return this.$scopedSlots[ 'marker-label-group' ](this.markerScope)
      }

      const fn = this.$scopedSlots[ 'marker-label' ]
      if (fn !== void 0) {
        return this.markerLabelsList.map(marker => fn({
          marker,
          ...this.markerScope
        }))
      }

      return this.markerLabelsList.map(marker => h('div', {
        key: marker.value,
        style: marker.style,
        class: marker.classes
      }, marker.label))
    },

    __onPan (event) {
      if (event.isFinal === true) {
        if (this.dragging !== void 0) {
          this.__updatePosition(event.evt)
          // only if touch, because we also have mousedown/up:
          event.touch === true && this.__updateValue(true)
          this.dragging = void 0
          this.$emit('pan', 'end')
        }
        this.active = false
        this.focus = false
      }
      else if (event.isFirst === true) {
        this.dragging = this.__getDragging(event.evt)
        this.__updatePosition(event.evt)
        this.__updateValue()
        this.active = true
        this.$emit('pan', 'start')
      }
      else {
        this.__updatePosition(event.evt)
        this.__updateValue()
      }
    },

    __onBlur () {
      this.focus = false
    },

    __onActivate (evt) {
      this.__updatePosition(evt, this.__getDragging(evt))
      this.__updateValue()

      this.preventFocus = true
      this.active = true

      document.addEventListener('mouseup', this.__onDeactivate, true)
    },

    __onDeactivate () {
      this.preventFocus = false
      this.active = false

      this.__updateValue(true)
      this.__onBlur()

      document.removeEventListener('mouseup', this.__onDeactivate, true)
    },

    __onMobileClick (evt) {
      this.__updatePosition(evt, this.__getDragging(evt))
      this.__updateValue(true)
    },

    __onKeyup (evt) {
      if (keyCodes.includes(evt.keyCode)) {
        this.__updateValue(true)
      }
    },

    __getTextContainerStyle (ratio) {
      if (this.vertical === true) { return null }

      const p = this.$q.lang.rtl !== this.reverse ? 1 - ratio : ratio
      return {
        transform: `translateX(calc(${2 * p - 1} * ${this.thumbSize} / 2 + ${50 - 100 * p}%))`
      }
    },

    __getThumb (h, thumb) {
      const thumbContent = [
        h('svg', {
          class: 'q-slider__thumb-shape absolute-full',
          attrs: {
            viewBox: '0 0 20 20',
            'aria-hidden': 'true'
          }
        }, [
          h('path', {
            attrs: { d: this.thumbPath }
          })
        ]),

        h('div', { class: 'q-slider__focus-ring fit' })
      ]

      if (this.label === true || this.labelAlways === true) {
        thumbContent.push(
          h('div', {
            class: this.pinClass + ' absolute fit no-pointer-events' + thumb.pinColor
          }, [
            h('div', {
              class: this.labelClass,
              style: { minWidth: this.thumbSize }
            }, [
              h('div', {
                class: this.textContainerClass,
                style: thumb.textContainerStyle
              }, [
                h('span', { class: thumb.textClass }, thumb.label)
              ])
            ])
          ])
        )

        if (this.name !== void 0 && this.disable !== true) {
          this.__injectFormInput(thumbContent, 'push')
        }
      }

      return h('div', {
        class: thumb.classes,
        style: thumb.style,
        ...thumb.nodeData
      }, thumbContent)
    },

    __getContent (h, injectThumb) {
      const trackContent = []

      this.innerTrackColor !== 'transparent' && trackContent.push(
        h('div', {
          key: 'inner',
          class: this.innerBarClass,
          style: this.innerBarStyle
        })
      )

      this.selectionColor !== 'transparent' && trackContent.push(
        h('div', {
          key: 'selection',
          class: this.selectionBarClass,
          style: this.selectionBarStyle
        })
      )

      this.markers !== false && trackContent.push(
        h('div', {
          key: 'marker',
          class: this.markerClass,
          style: this.markerStyle
        })
      )

      injectThumb(trackContent)

      const content = [
        h(
          'div',
          {
            key: 'trackC',
            class: this.trackContainerClass,
            attrs: this.trackContainerAttrs,
            on: this.trackContainerEvents,
            directives: this.panDirectives
          },
          [
            h('div', {
              class: this.trackClass,
              style: this.trackStyle
            }, trackContent)
          ]
        )
      ]

      if (this.markerLabels !== false) {
        const action = this.switchMarkerLabelsSide === true
          ? 'unshift'
          : 'push'

        content[ action ](
          h('div', {
            key: 'markerL',
            class: this.markerLabelsContainerClass
          }, this.__getMarkerLabelsContent(h))
        )
      }

      return content
    }
  },

  beforeDestroy () {
    document.removeEventListener('mouseup', this.__onDeactivate, true)
  }
}
