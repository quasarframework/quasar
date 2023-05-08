<template>
  <div class="relative-position">
    <img
      class="transition-list-box__ensure-img-loaded no-pointer-events absolute-bottom-left"
      src="https://cdn.quasar.dev/img/parallax1.jpg"
    />

    <q-btn
      class="call-to-action-btn q-mb-lg"
      no-caps
      label="Trigger All"
      padding="8px 16px"
      @click="triggerAll"
    />

    <div class="q-gutter-md row items-start">
      <div
        v-for="transition in transitions"
        :key="transition.name"
        class="transition-list-box relative-position overflow-hidden rounded-borders shadow-2 cursor-pointer non-selectable"
        @click="transition.trigger"
      >
        <transition :name="transition.css">
          <img
            class="transition-list-box__img absolute-full"
            :key="transition.name + '|' + transition.url"
            :src="transition.url"
          />
        </transition>

        <div class="transition-list-box__label absolute-bottom q-pa-sm text-center text-body2">
          {{ transition.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const urlFirst = 'https://cdn.quasar.dev/img/parallax2.jpg'
const urlSecond = 'https://cdn.quasar.dev/img/parallax1.jpg'

const transitions = ref([
  'slide-right',
  'slide-left',
  'slide-up',
  'slide-down',
  'fade',
  'scale',
  'rotate',
  'flip-right',
  'flip-left',
  'flip-up',
  'flip-down',
  'jump-right',
  'jump-left',
  'jump-up',
  'jump-down'
].map((name, index) => ({
  name,
  css: `q-transition--${ name }`,
  url: urlFirst,
  trigger: () => {
    const { url } = transitions.value[ index ]
    transitions.value[ index ].url = url === urlFirst
      ? urlSecond
      : urlFirst
  }
})))

function triggerAll () {
  transitions.value.forEach(transition => { transition.trigger() })
}
</script>

<style lang="sass">
.transition-list-box

  width: 150px
  height: 150px

  &:after
    content: ''
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: #000
    opacity: 0
    transition: opacity .28s ease-in-out

  &:hover:after
    opacity: .15

  &__img
    height: inherit
    width: inherit
    object-fit: cover
    object-position: 50% 50%

  &__label
    color: #fff
    background-color: rgba(0,0,0,.2)

  &__ensure-img-loaded
    opacity: 0
    width: 10px
    height: 10px
</style>
