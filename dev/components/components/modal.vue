<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see it in action.
      </p>

      <q-list style="max-width: 600px;">
        <q-item
          link
          v-for="modal in types"
          :key="modal.label"
          @click="$refs[modal.ref].show()"
          v-ripple.mat
        >
          <q-item-side icon="open_in_new" />
          <q-item-main :label="modal.label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
      </q-list>

      <p class="caption">Appear from Edges</p>
      <q-list style="max-width: 600px;">
        <q-item
          link
          v-for="position in ['top', 'bottom', 'left', 'right']"
          :key="position"
          @click="openSpecialPosition(position)"
          v-ripple.mat
        >
          <q-item-side icon="open_in_new" />
          <q-item-main :label="`Modal from ${position}`" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
      </q-list>
    </div>

    <q-toggle v-model="toggle" class="z-max fixed-top" />
    <q-modal v-model="toggle" ref="basicModal" :content-css="{padding: '50px', minWidth: '50vw'}">
      <h4>Basic Modal</h4>
      <p v-for="n in 25">Scroll down to close</p>
      <q-btn color="primary" @click="$refs.basicModal.hide()">Close</q-btn>
    </q-modal>

    <q-modal
      ref="eventsModal"
      @show="notify('open')"
      @escape-key="notify('escape-key')"
      @hide="notify('close')"
      :content-css="{padding: '50px', minWidth: '50vw'}"
    >
      <h4>Modal with Events</h4>
      <p v-for="n in 25">Scroll down to close</p>
      <q-btn color="primary" @click="$refs.eventsModal.hide()">Close</q-btn>
    </q-modal>

    <div class="fixed-bottom-right z-max bg-yellow">
      Ref <q-btn @click="show" label="Show" /><q-btn @click="hide" label="Hide" />
      <br>
      Model <q-btn @click="someModel = true" label="Show" /><q-btn @click="someModel = false" label="Hide" />
      <br>
      {{ someModel }}
    </div>
    <q-modal ref="layoutModal" v-model="someModel" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @show="onShow" @hide="onHide">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-icon style="font-size: 500%" class="cursor-pointer" name="map" @click="closeMe" />
          <q-btn flat @click="$refs.layoutModal.hide()">
            <q-icon name="keyboard_arrow_left" />
          </q-btn>
          <q-toolbar-title>
            Header
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
          <q-search inverted v-model="search" color="none"></q-search>
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-toolbar-title>
            Footer
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <h1>Modal</h1>

          <q-btn color="primary" @click="$refs.layoutModal.hide()">Close</q-btn>
          <p class="caption" v-for="n in 15">This is a Modal presenting a Layout.</p>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal ref="minimizedModal" minimized :content-css="{padding: '50px'}">
      <h4>Minimized Modal</h4>
      <p>This one has backdrop on small screens too.</p>
      <q-btn color="red" @click="$refs.minimizedModal.hide()">Close Me</q-btn>
    </q-modal>

    <q-modal ref="maximizedModal" maximized :content-css="{padding: '50px'}">
      <h4>Maximized Modal</h4><p>This one is maximized on bigger screens too.</p>
      <q-btn color="tertiary" @click="$refs.maximizedModal.hide()">Close Me</q-btn>
    </q-modal>

    <q-modal ref="positionModal" :position="position" :content-css="{padding: '20px'}">
      <h4>Modal</h4><p>This one gets displayed from {{position}}.</p>
      <q-btn color="orange" @click="$refs.positionModal.hide()">Close Me</q-btn>
    </q-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      toggle: false,
      someModel: false,
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
      ],
      position: 'bottom'
    }
  },
  methods: {
    notify (eventName) {
      this.$q.notify(`Event "${eventName}" was triggered.`)
    },
    openSpecialPosition (position) {
      this.position = position
      this.$nextTick(() => {
        this.$refs.positionModal.show()
      })
    },
    closeMe () {
      console.log('click')
      this.$refs.layoutModal.hide()
      this.$refs.layoutModal.hide()
    },
    onShow () {
      console.log('onShow')
    },
    onHide () {
      console.log('onHide')
    },
    show () {
      console.log('show')
      this.$refs.layoutModal.show().then(() => {
        console.log('---show finished')
      }, () => {
        console.log('---show cancelled')
      })
    },
    hide () {
      console.log('hide')
      this.$refs.layoutModal.hide().then(() => {
        console.log('---hide finished')
      }, () => {
        console.log('---hide cancelled')
      })
    }
  }
}
</script>
