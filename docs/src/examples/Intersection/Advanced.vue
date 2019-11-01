<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <q-list>
        <q-item
          v-for="n in 30"
          :key="n"
          :data-id="n"
          class="q-my-md q-pa-sm bg-grey-3"
          v-intersection="onIntersection"
        >
          <q-item-section class="text-center" style="background: #eee">
            Item #{{ n }}
          </q-item-section>
        </q-item>
      </q-list>

      <div class="example-filler" />
    </div>

    <div class="example-state bg-primary text-white overflow-hidden rounded-borders text-center absolute-top-left q-ma-md q-pa-sm">
      <transition-group v-if="inView.length > 0" name="in-view" tag="ul">
        <li v-for="i in inView" :key="i" class="in-view-item">
          {{i}}
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inView: []
    }
  },

  methods: {
    onIntersection (entry) {
      if (entry.isIntersecting === true) {
        this.add(entry.target.dataset.id)
      }
      else {
        this.remove(entry.target.dataset.id)
      }
    },

    add (i) {
      this.remove(i)
      this.inView.push(i)
      this.inView.sort(this.sortAtoi)
    },

    remove (i) {
      let index
      while ((index = this.inView.indexOf(i)) > -1) {
        this.inView.splice(index, 1)
        this.inView.sort(this.sortAtoi)
      }
    },

    sortAtoi (a, b) {
      return Number(a) - Number(b)
    }
  }
}
</script>

<style lang="sass" scoped>
.example-state
  width: 50px
  height: 226px
  opacity: 0.85

  ul
    list-style: none
    margin: 0
    padding: 0

  li
    padding: 0.5em

.example-area
  height: 300px

.example-filler
  height: 350px

.in-view-item
  transition: all 0.3s
  display: block

.in-view-enter, .in-view-leave-to
  opacity: 0
  transform: translateX(-30px)

.in-view-leave-active
  position: absolute
</style>
