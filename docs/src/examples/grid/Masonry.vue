<template>
  <div class="q-pa-md example-masonry">

    <q-btn class="q-mb-md" color="primary" label="Regenerate layout" @click="onClick" />

    <div class="column example-container">
      <div class="flex-break hidden"></div>
      <div class="flex-break"></div>
      <div class="flex-break"></div>
      <div class="flex-break"></div>

      <div v-for="(cell, i) in cells" :key="i" class="example-cell" tabindex="0">
        <div>
          <div v-for="(text, j) in cell" :key="j">
            {{ text }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'

const generateCells = () => Array(24).fill(null).map((_, cell) => (
  Array(2 + Math.ceil(3 * Math.random())).fill(null).map((_, text) => `Cell ${cell + 1} - ${text + 1}`)
))

export default {
  setup () {
    const cells = ref(generateCells())

    return {
      cells,
      onClick () {
        cells.value = generateCells()
      }
    }
  }
}
</script>

<style lang="sass">
.example-masonry
  .flex-break
    flex: 1 0 100% !important
    width: 0 !important

  $x: 4

  @for $i from 1 through ($x - 1)
    .example-container > div:nth-child(#{$x}n + #{$i})
      order: #{$i}

  .example-container > div:nth-child(#{$x}n)
    order: #{$x}

  .example-container
    height: 700px

    .example-cell
      width: 25%
      padding: 1px

      > div
        padding: 4px 8px
        box-shadow: inset 0 0 0 2px #9e9e9e
</style>
