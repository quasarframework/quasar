<template>
  <div>
    <div class="layout-padding">
      <q-dialog
        v-model="showDialog"
        ref="dialog"
        title="The title"
        message="The message"
        position="bottom"
        :form="form"
        @hide="onHide"
        @dismiss="onDismiss"
      >
        <!-- <template slot="buttons" slot-scope="props">
          <q-btn flat label="Cancel" @click="props.cancel(onCancel)" />
          <q-btn flat label="OK" @click="props.ok(onOK)" />
        </template> -->
      </q-dialog>

      {{ showDialog }}

      <q-btn label="Toggle" @click="toggle" />
      <q-btn label="Adhoc dialog" @click="adHoc" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDialog: false,
      form: [
        {
          name: 'name',
          type: 'text',
          label: 'Textbox',
          model: ''
        },
        {
          name: 'age',
          type: 'number',
          label: 'Numeric',
          model: 10,
          min: 5,
          max: 90
        },
        {
          name: 'comments',
          type: 'textarea',
          label: 'Textarea',
          model: ''
        }
      ]
    }
  },
  methods: {
    toggle () {
      console.log(this.$refs.dialog)
      this.$refs.dialog.show()
    },
    onOK (data) {
      console.log('onOK', data)
    },
    onCancel (data) {
      console.log('onCancel', data)
    },
    onHide (data) {
      console.log('onHide', data)
    },
    onDismiss (data) {
      console.log('onDismiss', data)
    },
    adHoc () {
      // const dialog =
      this.$q.dialog({
        title: 'Prompt',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        form: this.form,
        buttons: [
          'CancelZ',
          {
            label: 'OkZ',
            handler (data) {
              console.log('Returned ' + JSON.stringify(data))
            }
          }
        ]
      })

      setTimeout(() => {
        this.form[0].model = 'aaaa'
        /*
        setTimeout(() => {
            dialog.hide().then(data => {
            console.log(data)
          })
        }, 1000)
        */
      }, 1000)
    }
  }
}
</script>
