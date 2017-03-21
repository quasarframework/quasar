<template>
  <div>
    <q-fixed-position corner="top-right" :offset="{top: '18px', right: '18px'}">
      <q-btn class="primary" circular @click="alert" icon="alarm" />
    </q-fixed-position>
    <q-fixed-position corner="bottom-right" :offset="{right: '18px', bottom: '18px'}">
      <q-btn class="primary" circular @click="alert" icon="cloud" />
    </q-fixed-position>

    <q-btn class="primary absolute-top-left" circular @click="alert" icon="wifi" />

    <div class="layout-padding">
      <p v-for="n in 50">
        Layouts are the elements that wrap page content, like navigational bar,
        drawer, header or footer. Multiple pages can share the same Layout, which
        is one of the main reason for their existence.
      </p>
      <p>
        You can have multiple headers and/or footers. In each you can place
        <span class="token">Toolbars</span>,
        <span class="token">Tabs</span>,
        <span class="token">Search bars</span>
        or your own elements.
      </p>
      <p>
        Use it wisely with Vue Router.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    alert () {
      alert('aa')
    }
  }
}
</script>
