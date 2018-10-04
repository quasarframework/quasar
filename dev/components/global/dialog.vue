<template>
  <div>
    <div class="q-layout-padding">
      <q-dialog
        v-model="showDialog"
        ref="dialog"
        stack-buttons
        @cancel="onCancel"
        @escape-key="onEscape"
        @ok="onOk"
        @show="onShow"
        @hide="onHide"
      >
        <!-- This or use "title" prop on <q-dialog> -->
        <span slot="title">Favorite Superhero</span>

        <!-- This or use "message" prop on <q-dialog> -->
        <span slot="message">What is your superhero of choice?</span>

        <div slot="body">
          <q-field
            icon="account_circle"
            helper="We need your name so we can send you to the movies."
            label="Your name"
            :label-width="3"
            :error="nameError"
          >
            <q-input v-model="name" />
          </q-field>
        </div>

        <template slot="buttons" slot-scope="props">
          <q-btn color="primary" label="Choose Superman" @click="choose(props.ok, 'Superman')" />
          <q-btn color="black" label="Choose Batman" @click="choose(props.ok, 'Batman')" />
          <q-btn color="negative" label="Choose Spiderman" @click="choose(props.ok, 'Spiderman')" />
          <q-btn flat label="No thanks" @click="props.cancel()" />
        </template>
      </q-dialog>

      {{ showDialog }}

      <q-btn label="Toggle ref" @click="toggle" />
      <q-btn label="Toggle model" @click="toggle2" />
      <q-btn label="Prompt" @click="adHoc" />
      <q-btn label="Prompt - autoresolve in 3sec" @click="adHoc(3000, 'Autocompleted')" />
      <q-btn label="Prompt - autoreject in 3sec" @click="adHoc(3000)" />
      <q-btn label="Options" @click="adHoc2" />
      <q-btn label="Confirm" @click="adHoc3" />
      <q-btn label="Method" @click="asMethod" />
      <q-btn label="Toggle ref and test tooltip on close" @click="toggle">
        <q-tooltip>Tooltip</q-tooltip>
      </q-btn>
    </div>

    <q-input v-model="text" @keyup.enter="adHoc" />
  </div>
</template>

<script>
export default {
  methods: {
    openSpecialPosition (position) {
      this.$q.dialog({
        title: 'Positioned',
        message: `This dialog appears from ${position}.`,
        position
      })
    },
    toggle () {
      this.$refs.dialog.show()
    },
    toggle2 () {
      this.showDialog = !this.showDialog
    },
    onOk () {
      console.log('onOk')
    },
    onCancel () {
      console.log('onCancel')
    },
    onEscape () {
      console.log('onEscape')
    },
    onShow () {
      console.log('onShow')
    },
    onHide () {
      console.log('onHide')
    },
    choose (okFn, hero) {
      if (this.name.length === 0) {
        this.error = true
        this.$q.dialog({
          title: 'Please specify your name!',
          message: `Can't buy tickets without knowing your name.`
        })
      }
      else {
        Promise.resolve(okFn()).then(() => this.$q.notify(`Ok ${this.name}, going with ${hero}`))
      }
    },
    adHoc (autoclose, autoResolve) {
      const resolver = autoclose > 0
        ? new Promise((resolve, reject) => {
          setTimeout(() => autoResolve ? resolve(autoResolve) : reject(new Error('Autoclosed')), autoclose)
        })
        : undefined

      this.$q.dialog({
        title: 'Prompt',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        // preventClose: true,
        color: 'secondary'
      }, resolver).then(data => {
        console.log('>>>> OK, received:', data)
      }).catch(error => {
        console.log('>>>> Cancel', String(error))
      })
    },
    adHoc2 () {
      this.$q.dialog({
        title: 'Options',
        className: 'some-class',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        options: {
          type: 'checkbox',
          model: [],
          // inline: true
          items: [
            {label: 'Option 1', value: 'opt1', color: 'secondary'},
            {label: 'Option 2', value: 'opt2'},
            {label: 'Option 3', value: 'opt3'}
          ]
        },
        cancel: true,
        preventClose: true,
        color: 'secondary'
      }).then(data => {
        console.log('>>>> OK, received:', data)
      }).catch(() => {
        console.log('>>>> Cancel')
      })
    },
    adHoc3 () {
      this.$q.dialog({
        title: 'Alert',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        preventClose: true
      }).then(() => {
        console.log('>>> OK')
      }).catch(() => {
        console.log('>>> Cancel')
      })
    },
    asMethod () {
      this.$q.dialog({
        title: 'Alert',
        message: 'Modern HTML5 front-end framework on steroids.',
        cancel: true
      }).then(() => {
        console.log('ok')
      }).catch(() => {
        console.log('cancel')
      })
    }
  },
  watch: {
    name (val) {
      const err = val.length === 0
      if (this.nameError !== err) {
        this.nameError = err
      }
    }
  },
  data () {
    return {
      showDialog: false,
      name: '',
      nameError: false,
      text: ''
    }
  }
}
</script>
