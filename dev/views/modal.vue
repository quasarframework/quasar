<template>
  <p>
    <button class="primary" @click="openScreenModal()">Screen Modal</button>
    <button class="purple" @click="openSimpleModal()">Simple Modal</button>
  </p>
  <p>
    <button class="tertiary" @click="openMinimizedModal()">Minimized Modal</button>
    <button class="tertiary" @click="openMaximizedModal()">Maximized Modal</button>
  </p>
</template>

<script>
import { Modal, Notify } from 'quasar'
import ScreenModal from 'component/screen-modal.vue'
// import modalTemplate from './modal-template.html'

let number = 0

export default {
  methods: {
    openScreenModal () {
      var self = this;

      ScreenModal.methods.openModal = this.openScreenModal

      Modal.create(ScreenModal).css({
        minWidth: '80vw',
        minHeight: '80vh'
      }).show()
    },
    openSimpleModal () {
      Modal.create({
        template: '<h1 v-for="n in 10">Simple Modal</h1><button class="secondary" @click="close()">Close Me</button>'
      })
      .onShow(function() {
        Notify.create('Opened a simple modal');
      })
      .onClose(function() {
        Notify.create('Closed the simple modal');
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
