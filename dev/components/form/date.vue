<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
      </div>

      <div>{{ date }}</div>

      <q-date
        v-model="date"
        v-bind="props"
      />

      <q-date
        v-model="date"
        v-bind="props"
        orientation="landscape"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      disable: false,
      readonly: false,

      date: '2018/11/03'
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly
      }
    }
  }
}
</script>
