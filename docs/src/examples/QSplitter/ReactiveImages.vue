<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 300px"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="bg-black"
    >

      <template v-slot:before>
        <q-img
          src="https://cdn.quasar-framework.org/img/parallax1.jpg"
          :ratio="16/9"
        />
      </template>

      <template v-slot:after>
        <q-img
          src="https://cdn.quasar-framework.org/img/parallax1-inverted.jpg"
          :ratio="16/9"
        />
      </template>

    </q-splitter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: 50 // start at 50%
    }
  }
}
</script>
