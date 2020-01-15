<template>
  <div class="q-layout-padding">
    <button disabled @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" @click="onClick">
      Gogu
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </button>

    <button @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" @click="onClick">
      Gogu
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </button>

    <q-btn @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" disable color="primary" icon="warning" label="Notify" @click="onClick" class="q-ma-md">
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </q-btn>

    <q-btn @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" color="primary" icon="warning" label="Notify" @click="onClick" class="q-ma-md">
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </q-btn>

    <q-btn type="a" @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" disable color="primary" icon="warning" label="A.Notify" @click="onClick" class="q-ma-md">
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </q-btn>

    <q-btn type="a" @mouseenter="onMouse('enter')" @mouseleave="onMouse('leave')" color="primary" icon="warning" label="A.Notify" @click="onClick" class="q-ma-md">
      <q-tooltip anchor="bottom middle" self="top middle">
        This is a tooltip!
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onClick () {
      console.log('click')
    },

    onMouse (which) {
      console.log('@mouse' + which)
    }
  }
}
</script>
