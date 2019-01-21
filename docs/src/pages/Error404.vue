<template lang="pug">
.fixed-center.text-center.text-white
  p
    img(src='~assets/sad.svg', style='width:30vw;max-width:150px;')
  p.text-grey
    | Sorry, nothing here...
    strong  (404)
  q-btn(
    color='primary'
    style='width:200px;'
    to="/"
  ) Homepage
</template>

<script>
export default {
  name: 'Error404',

  meta: {
    title: 'Oops...'
  }
}
</script>
