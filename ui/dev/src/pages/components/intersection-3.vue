<template>
  <div class="q-pa-md">
    <div>
      <q-toggle v-model="visible" label="Visible" />
      <q-toggle v-model="once" label="Once" />
      <q-select v-model="transition" :options="['', 'fade', 'scale', 'flip-right']" style="min-width: 250px" />
    </div>
    <table v-if="visible" ref="table">
      <tr
        v-for="index in 10"
        :key="index"
      >
        <q-intersection
          v-for="i in 4"
          :key="index * 10 + i"
          :once="once"
          :transition="transition"
          tag="td"
          :root="tableEl"
          class="int-example-item"
        >
          <q-card class="q-ma-sm">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">

            <q-card-section>
              <div class="text-h6">
                Card #{{ index }}
              </div>
              <div class="text-subtitle2">
                by John Doe
              </div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true,
      once: false,
      transition: 'scale'
    }
  },
  computed: {
    tableEl () {
      return this.$refs.table ? this.$refs.table.$el : null
    }
  }
}
</script>

<style lang="sass">
.int-example-item
  height: 290px
  min-width: 290px
</style>
