<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row justify-center">
      <div class="q-gutter-md" style="max-width: 700px">
        <q-toggle v-model="dark" label="Dark" />
        <q-btn label="Alert" flat color="primary" @click="alert" />
        <q-btn label="Alert - custom" flat color="primary" @click="alertCustom" />
        <q-btn label="Confirm" flat color="primary" @click="confirm" />
        <q-btn label="Prompt" flat color="primary" @click="prompt" />
        <q-btn label="Radio Options" flat color="primary" @click="radio" />
        <q-btn label="Checkbox Options" flat color="primary" @click="checkbox" />
        <q-btn label="Toggle Options" flat color="primary" @click="toggle" />
        <q-btn label="Positioned" flat color="primary" @click="positioned" />
        <q-btn label="Stacked Buttons" flat color="primary" @click="stacked" />
        <q-btn label="Auto Closing" flat color="primary" @click="autoClose" />
        <q-btn label="Custom component" flat color="primary" @click="customComponent" />
        <q-btn label="With HTML" flat color="primary" @click="unsafe" />
      </div>
    </div>

    <div class="text-center text-caption q-mt-xl" style="height: 1500px">
      Page has scroll on purpose
    </div>
  </div>
</template>

<script>
import DialogComponent from './dialog-component.js'

export default {
  provide: {
    providedTest: 'Provide/Inject works!'
  },

  data () {
    return {
      dark: false
    }
  },

  methods: {
    hideDialog () {
      if (this.dialogHandler !== void 0) {
        this.dialogHandler.hide()
      }
    },

    alert () {
      this.dialogHandler = this.$q.dialog({
        title: 'Alert',
        message: 'Some message',
        dark: this.dark
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    alertCustom () {
      this.dialogHandler = this.$q.dialog({
        title: 'Alert',
        message: 'Some message',
        class: 'custom-dialog',
        dark: this.dark,
        ok: {
          color: 'black'
        }
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    confirm () {
      this.dialogHandler = this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to turn on the wifi?',
        ok: {
          push: true,
          textColor: this.dark ? 'primary' : 'white'
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true,
        dark: this.dark
      }).onOk(() => {
        console.log('>>>> OK')
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    prompt () {
      this.dialogHandler = this.$q.dialog({
        title: 'Prompt',
        message: 'What is your name?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true,
        color: 'secondary',
        dark: this.dark
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    radio () {
      this.dialogHandler = this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true,
        dark: this.dark
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    checkbox () {
      this.dialogHandler = this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'checkbox',
          model: [],
          // inline: true
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true,
        dark: this.dark
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    toggle () {
      this.dialogHandler = this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'toggle',
          model: [],
          // inline: true,
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true,
        dark: this.dark
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    positioned () {
      this.dialogHandler = this.$q.dialog({
        title: 'Positioned',
        message: 'This dialog appears from bottom.',
        position: 'bottom',
        dark: this.dark
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    stacked () {
      this.dialogHandler = this.$q.dialog({
        title: 'Stacked Buttons',
        stackButtons: true,
        cancel: true,
        dark: this.dark
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    autoClose () {
      this.dialogHandler = this.$q.dialog({
        title: 'Alert',
        message: 'Autoclosing in 3 seconds.',
        dark: this.dark
      }).onOk(() => {
        console.log('OK')
        clearTimeout(timer)
      }).onCancel(() => {
        console.log('Cancel')
        clearTimeout(timer)
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })

      const timer = setTimeout(() => {
        this.dialogHandler !== void 0 && this.dialogHandler.hide()
      }, 3000)
    },

    customComponent () {
      this.dialogHandler = this.$q.dialog({
        root: this,
        component: DialogComponent,
        // props forwarded to component:
        text: 'gigi'
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    },

    unsafe () {
      this.dialogHandler = this.$q.dialog({
        title: 'Alert <span class="text-red">me</span>',
        message: 'Some <strong>unsafe</strong> <em>message</em>',
        html: true,
        dark: this.dark,
        ok: {
          color: 'black'
        }
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        this.dialogHandler = void 0
      })
    }
  },

  beforeRouteLeave (to, from, next) {
    this.hideDialog()
    next()
  }
}
</script>

<style lang="stylus">
.custom-dialog
  color #33c
  background-color #ee9
  padding 40px
</style>
