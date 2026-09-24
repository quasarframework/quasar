<template>
  <div class="q-pa-md">
    <div ref="boxRef" class="scroll box rounded-borders q-mb-md">
      <div v-for="n in 30" :key="n" class="q-pa-sm">Line #{{ n }}</div>
    </div>

    <div class="q-gutter-sm">
      <q-badge :label="`top: ${position.top}`" />
      <q-badge :label="`direction: ${direction}`" />
      <q-badge :label="`delta: ${delta.top}`" />
      <q-badge :label="`inflection point: ${inflectionPoint.top}`" />
      <q-badge
        :color="directionChanged ? 'positive' : 'grey'"
        :label="directionChanged ? 'direction changed' : 'same direction'"
      />
    </div>
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import { useScroll } from 'quasar'

const boxRef = useTemplateRef('boxRef')

const { position, direction, directionChanged, delta, inflectionPoint } =
  useScroll({ scrollTarget: boxRef })
</script>

<style lang="sass" scoped>
.box
  height: 200px
  border: 1px solid #fff
  outline: 1px solid #000
</style>
