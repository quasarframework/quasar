<template>
  <div class="q-gutter-md row items-start">
    <q-card flat class="color" v-for="color in colors" :key="color">
      <q-card-section
        class="flex flex-center text-white"
        :class="'bg-' + color"
      >
        {{ color }}
      </q-card-section>

      <div
        class="detailed-color column flex-center"
        v-for="n in 14"
        :key="n"
        :class="[`bg-${color}-${n}`, n > 5 && n < 11 ? 'text-white': '']"
      >
        {{ color }}-{{ n }}
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      colors: [ 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey' ]
    }
  }
}
</script>

<style lang="sass" scoped>
.color
  width: 135px
.detailed-color
  height: 40px
</style>
