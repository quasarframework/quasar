<template lang="pug">
.quasar-course.row.justify-center
  a(href='https://dannys.link/quasarf' target='_blank')
    img.quasar-course-large(src='/statics/quasar-course-large.gif' alt='Get the Quasar Udemy Course!')
</template>

<style lang="sass">
.quasar-course
  &-large
    max-width: 100%
    width: auto
    max-height: 100px
    display: block
    @media (max-width: $breakpoint-xs)
      max-height: 50px
</style>
