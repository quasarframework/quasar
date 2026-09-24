<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-center">
      <q-badge
        :color="isIntersecting ? 'positive' : 'negative'"
        :label="isIntersecting ? 'in view' : 'out of view'"
      />
      <q-badge color="secondary" :label="`ratio: ${ratio}`" />
      <q-toggle v-model="once" label="once" />
    </div>

    <div ref="listRef" class="scroll list rounded-borders q-mt-md">
      <div class="filler">Scroll down...</div>

      <q-card ref="cardRef" flat bordered class="q-mx-auto q-my-md card">
        <img alt="Mountains" src="https://cdn.quasar.dev/img/mountains.jpg" />
        <q-card-section>
          <div class="text-h6">The observed card</div>
        </q-card-section>
      </q-card>

      <div class="filler">...and back up</div>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useIntersection } from 'quasar'

const listRef = useTemplateRef('listRef')
const cardRef = useTemplateRef('cardRef')

const once = ref(false)
const ratio = ref(0)

const { isIntersecting } = useIntersection(() => ({
  target: cardRef,
  root: listRef.value,
  threshold: [0, 0.25, 0.5, 0.75, 1],
  once: once.value,
  onIntersect(entry) {
    ratio.value = Math.round(entry.intersectionRatio * 100) / 100
  }
}))
</script>

<style lang="sass" scoped>
.list
  height: 250px
  border: 1px solid #fff
  outline: 1px solid #000

.card
  max-width: 300px

.filler
  height: 400px
  display: flex
  align-items: center
  justify-content: center
</style>
