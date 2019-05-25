<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        v-model="tab"
        dense
        align="left"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="center"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="right"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="justify"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'mails'
    }
  }
}
</script>
