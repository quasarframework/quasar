<template>
  <div class="q-pa-md">
    <div>
      <q-toggle v-model="visible" label="Visible" />
      <q-toggle v-model="once" label="Once" />
      <q-select v-model="transition" :options="['', 'fade', 'scale', 'flip-right']" style="min-width: 250px" />
    </div>
    <div class="row justify-center q-gutter-sm" v-if="visible">
      <q-intersection
        v-for="index in 600"
        :key="index"
        :once="once"
        :transition="transition"
        :tag="tags[index % 2]"
        class="int-example-item flex flex-center"
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true,
      once: false,
      transition: 'scale',
      tags: [ 'div', 'blockquote' ]
    }
  }
}
</script>

<style lang="sass">
.int-example-item
  height: 290px
  width: 290px
</style>
