<template>
  <p>
    <button class="primary" @click="openScreenModal()">Screen Modal</button>
    <button class="purple" @click="openSimpleModal()">Simple Modal</button>
  </p>
  <p>
    <button class="tertiary" @click="openMinimizedModal()">Minimized Modal</button>
    <button class="tertiary" @click="openMaximizedModal()">Maximized Modal</button>
  </p>
  <p>
    <button class="primary" @click="toggleModal()">Toggle Modal</button>
    <button class="primary" @click="showInlineModal()">Show Inline Modal</button>
  </p>

  <quasar-modal :set="{minimized: true}" :css="{minWidth: '30vw', minHeight: '30vh'}" v-ref:modal>
    <div style="padding: 50px">
      <div>Some simple Modal</div>
      <div>Variable from parent Vue scope: {{ modalVariable }}</div>
      <br><br>
      <button class="primary" @click="$refs.modal.close()">Close</button>
    </div>
  </quasar-modal>

  <div style="height: 2000px">&nbsp;</div>
</template>

<script>
import { Modal, Toast } from 'quasar'
import ScreenModal from 'component/screen-modal.vue'

let modals = 0

export default {
  mounted () {
    this.modal = Modal.create({
      template: 'Modal will close shortly'
    }).set({
      selfDestroy: false,
      minimized: true
    })
  },
  beforeDestroy () {
    this.modal.destroy()
  },
  data () {
    return {
      modalVariable: 5
    }
  },
  methods: {
    showInlineModal () {
      this.$refs.modal.show()
    },
    toggleModal () {
      this.modal.show()
      setTimeout(() => {
        this.modal.close()
      }, 2000)
    },
    openScreenModal () {
      ScreenModal.methods.openModal = this.openScreenModal

      Modal.create(ScreenModal).css({
        minWidth: '80vw',
        minHeight: '80vh'
      }).show()
    },
    openSimpleModal () {
      modals++
      Modal.create({
        template: '<button class="primary" @click="open">Open Another</button><div>' + modals + '</div><h1 v-for="n in 10">Simple Modal</h1><button class="secondary" @click="close()">Close Me</button>',
        methods: {
          open: () => {
            this.openSimpleModal()
          }
        }
      })
      .onShow(() => {
        Toast.create('Opened a simple modal')
      })
      .onClose(() => {
        Toast.create('Closed the simple modal')
      })
      .css({
        padding: '50px',
        minWidth: '50vw'
      })
      .show()
    },
    openMinimizedModal () {
      Modal.create({
        template: '<h1>Simple Modal</h1><p>This one has backdrop on small screens too.</p>' +
                  '<button class="tertiary" @click="close()">Close Me</button>'
      }).set({
        minimized: true
      }).css({
        padding: '50px'
      }).show()
    },
    openMaximizedModal () {
      Modal.create({
        template: '<h1>Simple Modal</h1><p>This one is maximized on bigger screens too.</p>' +
                  '<button class="tertiary" @click="close()">Close Me</button>'
      }).set({
        maximized: true
      }).css({
        padding: '50px'
      }).show()
    }
  }
}
</script>
