<template>
  <div>Tab <mark>two</mark> Content</div>
</template>

<script setup>
import { onBeforeRouteLeave } from 'vue-router'

defineOptions({ name: 'Two' })

const props = defineProps({
  allowRouteChange: Boolean
})

onBeforeRouteLeave(() => {
  console.log(
    props.allowRouteChange ? 'allowing navigation' : 'denying navigation'
  )
  return props.allowRouteChange
})
</script>
