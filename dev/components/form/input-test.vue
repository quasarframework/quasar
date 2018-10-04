<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-color
      clearable
      class="q-ma-sm"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @input="onInput"
      @clear="onClear"
      v-model="color"
      modal
      placeholder="Color (RGBA)"
      :after="[ { icon: 'colorize', handler () { color = defaultColor } }]" />

    <q-color
      clearable
      class="q-ma-sm"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @clear="onClear"
      :value="color"
      @change="onChange2"
      placeholder="Color (RGBA)"
      modal
      :after="[ { icon: 'colorize', handler () { color = null; $nextTick(() => { color = defaultColor }) } }]" />

    <br><br>
    <q-color
      clearable
      class="q-ma-sm"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @input="onInput"
      @clear="onClear"
      v-model="color"
      popover
      placeholder="Color (RGBA)"
      :after="[ { icon: 'colorize', handler () { color = defaultColor } }]" />

    <q-color
      clearable
      class="q-ma-sm"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @clear="onClear"
      :value="color"
      @change="onChange2"
      placeholder="Color (RGBA)"
      popover
      :after="[ { icon: 'colorize', handler () { color = null; $nextTick(() => { color = defaultColor }) } }]" />

    <br><br>
    <q-datetime
      clearable
      type="datetime"
      class="q-ma-sm"
      @focus="donFocus"
      @blur="donBlur"
      @change="donChange"
      @input="donInput"
      @clear="donClear"
      v-model="date"
      modal
      placeholder="Date"
      :after="[ { icon: 'today', handler () { date = defaultDate } }]" />

    <q-datetime
      clearable
      type="datetime"
      class="q-ma-sm"
      @focus="donFocus"
      @blur="donBlur"
      @input="donInput"
      @clear="donClear"
      :value="date"
      @change="donChange2"
      placeholder="Date"
      modal
      :after="[ { icon: 'today', handler () { date = null; $nextTick(() => { date = defaultDate }) } }]" />

    <br><br>
    <q-datetime
      clearable
      type="datetime"
      class="q-ma-sm"
      @focus="donFocus"
      @blur="donBlur"
      @change="donChange"
      @input="donInput"
      @clear="donClear"
      v-model="date"
      popover
      placeholder="Date"
      :after="[ { icon: 'today', handler () { date = defaultDate } }]" />

    <q-datetime
      clearable
      type="datetime"
      class="q-ma-sm"
      @focus="donFocus"
      @blur="donBlur"
      @input="donInput"
      @clear="donClear"
      :value="date"
      @change="donChange2"
      placeholder="Date"
      popover
      :after="[ { icon: 'today', handler () { date = null; $nextTick(() => { date = defaultDate }) } }]" />

    <div>Test number - force update: {{ numberTester }}</div>
    <div>{{ number }}</div>
    <q-input type="number" v-model="number" float-label="Test number 1" />
    <q-input type="number" v-model="number" float-label="Test number 2" />

  </div>
</template>

<script>
export default {
  data () {
    return {
      color: '#aaa',
      defaultColor: '#0f0',

      date: new Date(),
      defaultDate: new Date(2016, 5, 20),

      number: 1.1,
      numberTester: 0
    }
  },
  methods: {
    onFocus (v) {
      console.log('onFocus', v)
    },
    onBlur (v) {
      console.log('onBlur', v)
    },
    onChange (v) {
      console.log('onChange', v)
    },
    onChange2 (v) {
      console.log('onChange2', v)
      this.color = v
    },
    onInput (v) {
      console.log('onInput', v)
    },
    onClear (v) {
      console.log('onClear', v)
    },

    donFocus (v) {
      console.log('donFocus', v)
    },
    donBlur (v) {
      console.log('donBlur', v)
    },
    donChange (v) {
      console.log('donChange', v)
    },
    donChange2 (v) {
      console.log('donChange2', v)
      this.date = v
    },
    donInput (v) {
      console.log('donInput', v)
    },
    donClear (v) {
      console.log('donClear', v)
    }
  },
  mounted () {
    this.$timer = setInterval(() => {
      this.numberTester += 1
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.$timer)
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
