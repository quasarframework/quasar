<template>
  <div>
    <div class="q-layout-padding" :class="{ guidelines }">
      <div v-for="dense in [false, true]" :key="dense">
        <div v-for="(mode, index) in modes" :key="index">
          <p class="caption">{{ dense ? 'Dense' : 'Normal' }} {{ filterMode(mode) }}</p>
          <div class="row no-wrap gutter-x-sm size-test-example">
            <div>
              <div>
                <q-input
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-input
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  stack-label="Stack Label"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-input
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  float-label="Float Label"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div>
              <div>
                <q-select
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  v-model="select"
                  :options="selectOptions"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-select
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  stack-label="Stack Label"
                  v-model="select"
                  :options="selectOptions"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-select
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  float-label="Float Label"
                  v-model="select"
                  :options="selectOptions"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div>
              <div>
                <q-search
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-search
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  stack-label="Stack Label"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-search
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  float-label="Float Label"
                  v-model="text"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div>
              <div>
                <q-color
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="time"
                  v-model="color"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-color
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="time"
                  stack-label="Stack Label"
                  v-model="color"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-color
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="time"
                  float-label="Float Label"
                  v-model="color"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="date"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="date"
                  stack-label="Stack Label"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="date"
                  float-label="Float Label"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="datetime"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="datetime"
                  stack-label="Stack Label"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
              <div>
                <q-datetime
                  :hide-underline="mode.hideUnderline"
                  :inverted="mode.inverted"
                  :box="mode.box"
                  :outline="mode.outline"
                  :full-width="mode.fullWidth"
                  :dense="dense"
                  type="datetime"
                  float-label="Float Label"
                  v-model="date"
                  :class="classes"
                  clearable
                />
              </div>
            </div>

            <div v-if="!margin && !padding">
              <div>
                <q-btn color="primary"
                       :size="`${ mode.btnSize }${ dense ? '-dense' : '' }`"
                       :outline="!mode.inverted && !mode.fullWidth"
                       :flat="mode.fullWidth"
                       label="Button"
                       class="row"
                       :class="btnClasses(mode, dense)"
                />
              </div>
              <div>
                <q-btn color="primary"
                       :size="`${ mode.btnSizeLabel }${ dense ? '-dense' : '' }`"
                       :outline="!mode.inverted && !mode.fullWidth"
                       :flat="mode.fullWidth"
                       label="Button"
                       class="row"
                       :class="btnClasses(mode, dense)"
                />
              </div>
              <div>
                <q-btn color="primary"
                       :size="`${ mode.btnSizeLabel }${ dense ? '-dense' : '' }`"
                       :outline="!mode.inverted && !mode.fullWidth"
                       :flat="mode.fullWidth"
                       label="Button"
                       class="row"
                       :class="btnClasses(mode, dense)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed-top-left bg-grey-3 q-pa-sm" style="top: 8px; left: 8px; z-index: 10;">
        <div class="row no-wrap gutter-sm">
          <q-toggle v-model="guidelines" label="Guidelines" />
          <div>
            <q-select hide-underline class="q-my-none q-py-none" placeholder="Margin Y" v-model="margin" :options="sizes" clearable />
          </div>
          <div>
            <q-select hide-underline class="q-my-none q-py-none" placeholder="Padding Y" v-model="padding" :options="sizes" clearable />
          </div>
        </div>
      </div>
      <div style="height: 350px"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'AQGqftj',
      date: '2016-09-18T10:45:00.000Z',
      color: '#fea8a8',
      select: null,
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ],
      guidelines: false,
      sizes: ['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(size => ({
        label: size,
        value: size
      })),
      margin: null,
      padding: null,
      modes: [
        { hideUnderline: false, inverted: false, box: false, outline: false, fullWidth: false, btnSize: 'form', btnSizeLabel: 'form-label' },
        { hideUnderline: true, inverted: false, box: false, outline: false, fullWidth: false, btnSize: 'form-hide-underline', btnSizeLabel: 'form-label-hide-underline' },
        { hideUnderline: false, inverted: true, box: false, outline: false, fullWidth: false, btnSize: 'form', btnSizeLabel: 'form-label' },
        { hideUnderline: false, inverted: false, box: true, outline: false, fullWidth: false, btnSize: 'form', btnSizeLabel: 'form-label' },
        { hideUnderline: false, inverted: false, box: false, outline: true, fullWidth: false, btnSize: 'form-label', btnSizeLabel: 'form-label' },
        { hideUnderline: false, inverted: false, box: false, outline: false, fullWidth: true, btnSize: 'form-label', btnSizeLabel: 'form-label' }
      ]
    }
  },
  computed: {
    classes () {
      const classes = [ 'inline' ]
      classes.push(this.margin ? `q-my-${this.margin}` : 'q-my-form')
      if (this.padding) {
        classes.push(`q-py-${this.padding}`)
      }
      return classes
    }
  },
  methods: {
    filterMode (mode) {
      return Object.keys(mode).filter(k => mode[k] === true).map(k => `${k[0].toUpperCase()}${k.slice(1)}`).join(', ')
    },
    btnClasses (mode, dense) {
      if (this.margin) {
        return this.margin
      }
      if (mode.fullWidth) {
        return ''
      }
      return dense ? ['q-mt-dense', 'q-mb-xs'] : ['q-mt-md', 'q-mb-sm']
    }
  }
}
</script>

<style lang="stylus">
.q-mt-dense
  margin-top 12px
.size-test-example > div > div
  background-color white
.guidelines .size-test-example > div
  > div
    &:before, &:after
      content ''
      display block
      position absolute
      left 0
      right 0
      height 0
      background-color transparent
    &:before
      border-top 1px solid rgba(255, 0, 0, .2)
    &:after
      border-bottom 1px solid rgba(0, 255, 0, .2)
  &:last-child > div
    &:before, &:after
      border-color rgba(0, 0, 255, .4)
</style>
