<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="row q-col-gutter-md justify-stretch">
        <div class="col-12">Router-links</div>

        <div v-for="n in 5" :key="'r-link.' + n">
          <router-link class="special-router-link" replace :to="{ query: { tab: '' + n, noScroll: true } }" active-class="special-router-link--active" exact-active-class="special-router-link--exact-active">
            [ {{ n }} ]
          </router-link>
        </div>

        <div class="col-12">QItems</div>

        <div v-for="n in 5" :key="'q-item.' + n">
          <q-item class="special-router-link" replace :to="{ query: { tab: '' + n, noScroll: true } }" active-class="special-router-link--active" exact-active-class="special-router-link--exact-active">
            <q-item-section>[ {{ n }} ]</q-item-section>
          </q-item>
        </div>

        <div class="col-12">Route query {{ $route.query }}</div>

        <div>
          <q-item class="special-router-link" replace :to="{ query: { tab: '3', noScroll: true, y: '5' } }" active-class="special-router-link--active" exact-active-class="special-router-link--exact-active">
            <q-item-section>3 + y=5 - select 3*</q-item-section>
          </q-item>
        </div>

        <div>
          <q-item class="special-router-link" replace :to="{ query: { tab: '3' } }" active-class="special-router-link--active" exact-active-class="special-router-link--exact-active">
            <q-item-section>{ tab: 3 } - select none</q-item-section>
          </q-item>
        </div>
      </div>

      <q-tabs no-caps class="bg-orange text-white">
        <q-route-tab replace :to="{ query: { tab: '1', noScroll: true } }" label="[1*] Activate in 2s" @click="navDelay" />
        <q-route-tab replace :to="{ query: { tab: '2', noScroll: true } }" label="[2*] Do nothing" @click="navCancel" />
        <q-route-tab replace :to="{ query: { tab: '3', noScroll: true } }" label="[3*] Navigate to the second tab" @click="navRedirect" />
        <q-route-tab replace :to="{ query: { tab: '3', noScroll: true } }" exact label="[3] exact" @click="navPass" />
        <q-route-tab replace :to="{ query: { tab: '4', noScroll: true } }" label="[4*] Navigate immediately" @click="navPass" />

        <q-route-tab replace :to="{ query: { tab: '5', noScroll: true } }" label="[5*] With button" @click="navPass">
          <q-btn unelevated :label="`Click (${ clickCounter })`" @click.stop.prevent="onClick" />
        </q-route-tab>
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      clickCounter: 0
    }
  },

  methods: {
    navDelay (e, go) {
      e.preventDefault() // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    },

    navCancel (e) {
      e.preventDefault() // we cancel the default navigation
    },

    navRedirect (e, go) {
      e.preventDefault() // we cancel the default navigation
      go({
        to: { query: { tab: '2', noScroll: true } }
      })
    },

    navPass () {},

    onClick () {
      this.clickCounter += 1
    }
  }
}
</script>

<style lang="sass">
.special-router-link
  text-align: center
  text-decoration: none
  color: black
  padding: 12px
  border: 1px solid black
  minwidth: 50px

  &--active
    background-color: #ee9

  &--exact-active
    background-color: #9e9
</style>
