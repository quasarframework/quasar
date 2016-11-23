<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see it in action.
      </p>

      <div class="list" style="max-width: 600px;">
        <div
          class="item item-link"
          v-for="modal in types"
          @click="$refs[modal.ref].open()"
        >
          <i class="item-primary">open_in_new</i>
          <div class="item-content has-secondary">
            <div>{{modal.label}}</div>
          </div>
          <i class="item-secondary">keyboard_arrow_right</i>
        </div>
      </div>
    </div>

    <q-modal ref="basicModal" :content-css="{padding: '50px', minWidth: '50vw'}">
      <h4>Basic Modal</h4>
      <p v-for="n in 25">Scroll down to close</p>
      <button class="primary" @click="$refs.basicModal.close()">Close</button>
    </q-modal>

    <q-modal
      ref="eventsModal"
      @open="notify('open')"
      @escape-key="notify('escape-key')"
      @close="notify('close')"
      :content-css="{padding: '50px', minWidth: '50vw'}"
    >
      <h4>Modal with Events</h4>
      <p v-for="n in 25">Scroll down to close</p>
      <button class="primary" @click="$refs.eventsModal.close()">Close</button>
    </q-modal>

    <q-modal ref="layoutModal" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-layout>
        <div slot="header" class="toolbar">
          <button @click="$refs.layoutModal.close()">
            <i>keyboard_arrow_left</i>
          </button>
          <q-toolbar-title :padding="1">
            Header
          </q-toolbar-title>
        </div>

        <div slot="header" class="toolbar primary">
          <q-search class="primary"></q-search>
        </div>

        <div slot="footer" class="toolbar">
          <q-toolbar-title :padding="1">
            Footer
          </q-toolbar-title>
        </div>

        <div class="layout-view">
          <div class="layout-padding">
            <h1>Modal</h1>
            <button class="primary" @click="$refs.layoutModal.close()">Close</button>
            <p class="caption" v-for="n in 15">This is a Modal presenting a Layout.</p>
          </div>
        </div>
      </q-layout>
    </q-modal>

    <q-modal ref="minimizedModal" class="minimized" :content-css="{padding: '50px'}">
      <h4>Minimized Modal</h4>
      <p>This one has backdrop on small screens too.</p>
      <button class="tertiary" @click="$refs.basicModal.close()">Close Me</button>
    </q-modal>

    <q-modal ref="maximizedModal" class="maximized" :content-css="{padding: '50px'}">
      <h4>Maximized Modal</h4><p>This one is maximized on bigger screens too.</p>
      <button class="tertiary" @click="$refs.maximizedModal.close()">Close Me</button>
    </q-modal>
  </div>
</template>

<script>
import { Toast } from 'quasar'

export default {
  data () {
    return {
      types: [
        {
          label: 'Basic',
          ref: 'basicModal'
        },
        {
          label: 'Basic with Events',
          ref: 'eventsModal'
        },
        {
          label: 'With Layout',
          ref: 'layoutModal'
        },
        {
          label: 'Always Minimized',
          ref: 'minimizedModal'
        },
        {
          label: 'Always Maximized',
          ref: 'maximizedModal'
        }
      ]
    }
  },
  methods: {
    notify (eventName) {
      Toast.create(`Event "${eventName}" was triggered.`)
    }
  }
}
</script>
