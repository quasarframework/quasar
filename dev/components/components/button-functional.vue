<template>
  <div>
    <div class="layout-padding">
      <div class="q-my-sm row gutter-sm items-center">
        <div>
          <q-btn type="button" size="lg" label="Button" @click="onClick" />
        </div>
        <div>
          <q-btn type="a" size="lg" label="Link" text-color="primary" @click="onClick" />
        </div>
        <div>
          <q-btn round type="button" size="lg" icon="alarm" @click="onClick" />
        </div>
        <div>
          <q-btn round type="a" size="lg" icon="alarm" text-color="primary" @click="onClick" />
        </div>
        <div>
          <q-btn outline type="button" size="lg" label="Button" @click="onClick" />
        </div>
        <div>
          <q-btn outline type="a" size="lg" label="Link" color="primary" @click="onClick" />
        </div>
        <div>
          <q-btn outline round type="button" size="lg" icon="alarm" @click="onClick" />
        </div>
        <div>
          <q-btn outline round type="a" size="lg" icon="alarm" color="primary" @click="onClick" />
        </div>
        <div>
          <q-btn push type="button" size="lg" label="Button" @click="onClick" />
        </div>
        <div>
          <q-btn push type="a" size="lg" label="Link" text-color="primary" @click="onClick" />
        </div>
        <div>
          <q-btn push round type="button" size="lg" icon="alarm" @click="onClick" />
        </div>
        <div>
          <q-btn push round type="a" size="lg" icon="alarm" text-color="primary" @click="onClick" />
        </div>
      </div>

      <div class="row flex-center q-my-md">
        <q-btn round repeat class="on-left" icon="remove" v-touch-repeat:0:600.enter.space="() => { testN -= 1 }" />
        <q-btn push round repeat class="on-left" icon="remove" v-touch-repeat.enter.space="() => { testN -= 1 }" />
        <q-input type="number" v-model="testN" align="right" />
        <q-btn push round repeat class="on-right" icon="add" v-touch-repeat.enter.space="() => { testN += 1 }" />
        <q-btn round repeat class="on-right" icon="add" v-touch-repeat:0:600.enter.space="() => { testN += 1 }" />
      </div>

      <form @submit.prevent="submit" @reset.prevent="reset" class="shadow-2 q-pa-md q-my-sm row items-center">
        <div class="col row items-center gutter-md">
          <div class="col">
            <q-input v-model="test" type="textarea" />
          </div>
          <div class="col">
            <q-input :value="testC" @change="v => testC = v" />
          </div>
          <div class="col">
            <q-input type="number" v-model="testN" />
          </div>
        </div>
        <q-btn fab-mini outline color="negative" icon="undo" type="reset" class="on-right" title="Reset" @click="onClick" />
        <q-btn fab outline color="primary" icon="send" type="submit" class="on-right" title="Submit" @click="onClick" />
      </form>

      <form @submit.prevent="submit" class="shadow-2 q-pa-md q-my-sm row items-center">
        <div class="col row items-center gutter-md">
          <div class="col">
            <q-input v-model="test" type="textarea" />
          </div>
          <div class="col">
            <q-input :value="testC" @change="v => testC = v" />
          </div>
          <div class="col">
            <q-input type="number" v-model="testN" />
          </div>
        </div>
        <q-btn outline color="primary" label="Button" class="on-right" @click="onClick" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      test: 'Initial value',
      testC: 'Initial value onChange',
      testN: 0
    }
  },
  methods: {
    submit () {
      this.$q.notify(`Submit called with: [${this.test}], [${this.testC}], [${this.testN}]`)
    },
    reset () {
      this.test = 'Initial value'
      this.testC = 'Initial value onChange'
      this.testN = 0
      this.$q.notify('Reset called')
    },
    onClick (e) {
      this.$q.notify('Click called')
      console.log('@click', e.target, e)
    }
  }
}
</script>
