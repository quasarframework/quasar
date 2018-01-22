<template>
  <div>
    <div class="layout-padding">
      <q-dialog
        v-model="showDialog"
        ref="dialog"
        stack-buttons
        @cancel="onCancel"
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
      <q-btn label="Options" @click="adHoc2" />
      <q-btn label="Confirm" @click="adHoc3" />
    </div>
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
      console.log('ok')
    },
    onCancel () {
      console.log('cancel')
    },
    onShow () {
      console.log('show')
    },
    onHide () {
      console.log('hide')
    },
    async choose (okFn, hero) {
      if (this.name.length === 0) {
        this.error = true
        this.$q.dialog({
          title: 'Please specify your name!',
          message: `Can't buy tickets without knowing your name.`
        })
      }
      else {
        await okFn()
        this.$q.notify(`Ok ${this.name}, going with ${hero}`)
      }
    },
    adHoc () {
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
      }).then(data => {
        console.log('>>>> OK, received:', data)
      }).catch(() => {
        console.log('>>>> Cancel')
      })
    },
    adHoc2 () {
      this.$q.dialog({
        title: 'Options',
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
        cancel: true,
        preventClose: true
      }).then(() => {
        console.log('>>> OK')
      }).catch(() => {
        console.log('>>> Cancel')
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
      nameError: false
    }
  }
}
</script>
