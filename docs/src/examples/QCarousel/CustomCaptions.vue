<template>
  <div class="q-pa-md q-gutter-md docs-carousel">
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        infinite
        style="width: 80%;"
      >
        <q-carousel-slide name="first" img-src="https://cdn.quasar-framework.org/img/mountains.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">First stop</div>
            <div class="text-subtitle1">Mountains</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="second" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Second stop</div>
            <div class="text-subtitle1">Famous City</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="third" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Third stop</div>
            <div class="text-subtitle1">Famous Bridge</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 'first'
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.docs-carousel
  p.caption:not(:first-of-type)
    margin-top 38px
  .custom-caption
    text-align center
    padding 12px
    color white
</style>
