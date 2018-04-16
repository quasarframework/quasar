<template>
  <div>
    <div class="layout-padding text-center" id="view-colors">
      <h5>Main Colors</h5>
      <div
        class="main-color shadow-1 row inline flex-center text-white"
        v-for="color in mainColors"
        :key="color"
        :class="'bg-' + color"
      >
        <div class="col">{{color}}</div>
        <q-btn flat dense round icon="colorize" @click="selectColor(color)" v-if="color !== 'black'" />
      </div>
      <div
        class="main-color shadow-1 row inline flex-center text-dark"
        v-for="color in mainLightColors"
        :key="color"
        :class="'bg-' + color"
      >
        <div class="col">{{color}}</div>
        <q-btn flat dense round icon="colorize" @click="selectColor(color)" v-if="color !== 'white'" />
      </div>
      <div v-if="currentColor" class="row justify-center items-end q-mt-md">
        <div class="q-px-md q-py-sm shadow-2">
          <q-color color="dark" hide-underline :value="mainColorValues[currentColor]" @input="val => setColor(currentColor, val)" :after="[ { icon: 'undo', handler () { undoColor(currentColor) } }]" />
        </div>
      </div>

      <h5>Full Palette</h5>
      <div class="detail" v-for="color in colors" :key="color">
        <h5 class="detailed-color shadow-1 column flex-center text-white" :class="'bg-' + color">{{color}}</h5>
        <div class="detailed-color column flex-center" v-for="n in 14" :key="n" :class="'bg-' + color + '-' + n">{{color}}-{{(n)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { clone, colors } from 'quasar'

const mainColors = ['primary', 'secondary', 'tertiary', 'positive', 'negative', 'info', 'warning', 'faded', 'dark', 'black']
const mainLightColors = ['white', 'light']
let mainColorValuesOrig

export default {
  data () {
    const style = getComputedStyle(document.body)
    const mainColorValues = [...mainColors, ...mainLightColors]
      .filter(c => !['white', 'black'].includes(c))
      .reduce((acc, color) => {
        acc[color] = style.getPropertyValue(`--q-color-${color}`) || null
        return acc
      }, {})
    if (!mainColorValuesOrig) {
      mainColorValuesOrig = clone(mainColorValues)
    }

    return {
      mainColors,
      mainLightColors,
      mainColorValues,
      mainColorValuesOrig,
      currentColor: null,
      colors: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']
    }
  },
  methods: {
    selectColor (color) {
      setTimeout(() => {
        this.currentColor = color
      }, 300)
    },
    setColor (color, value) {
      this.mainColorValues[color] = value
      colors.setBrand(color, value)
    },
    undoColor (color) {
      const value = this.mainColorValuesOrig[color]
      this.mainColorValues[color] = value
      colors.setBrand(color, value)
    }
  }
}
</script>

<style lang="stylus">
#view-colors
  div.main-color
    width 130px
    margin 5px
    height 40px

  .detailed-color
    width 100%

  div.detailed-color
    height 55px

  div.detail
    margin-bottom 25px
    max-width 400px
    min-width 135px
    display inline-block
    margin-right 5px

  h5
    margin-bottom 5px
</style>
