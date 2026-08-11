<template>
  <div>Tab <mark>one</mark> Content</div>
</template>

<script setup>
import { onBeforeRouteLeave } from 'vue-router'

defineOptions({ name: 'One' })

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
