<template>
  <div class="q-pa-md row justify-center">
    <aside class="ticker">
      <transition-group v-if="inView" name="in-view" tag="ul">
        <li v-for="i in inView" :key="i" class="in-view-item">{{i}}</li>
      </transition-group>
      <span v-else>No items in view</span>
    </aside>
    <div class="q-layout-padding q-ma-lg scroll relative-position container">
      <q-list>
        <q-item
          v-for="n in 100"
          :key="n"
          ref="items"
          :data-id="n"
          v-visible="onVisible"
        >
          <q-item-section class="q-pl-sm item items-center" style="background: #eee">
            Item #{{ n }}
          </q-item-section>
        </q-item>
      </q-list>
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
    onVisible (data) {
      if (data.isIntersecting === true) {
        this.add(data.target.dataset.id)
      }
      else {
        this.remove(data.target.dataset.id)
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
.container
  width: 400px
  height: 400px
  border: #ccc solid 1px

.item
  padding: 2rem
  width: 100%
  background-color: whitesmoke
  border-radius: 6px
  margin: .5rem 0
  display: flex
  justify-content: center

.ticker
  position: absolute
  top: 3rem
  left: 3.1rem
  background-color: aliceblue
  padding: 1rem
  border-radius: 6px
  z-index: 1

.ticker ul
  list-style: none
  margin: 0
  padding: 0

.ticker li
  padding: 0.5em

.in-view-item
  transition: all 0.3s
  display: block

.in-view-enter, .in-view-leave-to
  opacity: 0
  transform: translateX(-30px)

.in-view-leave-active
  position: absolute

</style>
