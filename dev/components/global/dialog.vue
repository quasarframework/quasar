<template>
  <div>
    <div class="layout-padding">
      <q-dialog
        v-model="showDialog"
        ref="dialog"
        title="The title"
        message="The message"
        @show="onShow"
        @hide="onHide"
        @cancel="onCancel"
        @ok="onOk"
      >
        <!-- <template slot="buttons" slot-scope="props">
          <q-btn flat label="Cancel" @click="props.cancel(onCancel)" />
          <q-btn flat label="OK" @click="props.ok(onOK)" />
        </template> -->
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
import langRo from '../../../i18n/ro'
import Quasar from 'quasar'

export default {
  data () {
    return {
      showDialog: false
    }
  },
  methods: {
    toggle () {
      this.$refs.dialog.show()
    },
    toggle2 () {
      this.showDialog = !this.showDialog
    },
    onOk (data) {
      console.log('>>> onOK', data)
    },
    onCancel (data) {
      console.log('>>> onCancel', data)
    },
    onHide (data) {
      console.log('>>> onHide', data)
    },
    onShow (data) {
      console.log('>>> onShow', data)
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

      setTimeout(() => {
        Quasar.i18n.set(langRo)
      }, 3000)
    }
  }
}
</script>
