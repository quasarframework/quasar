<template>
  <div class="q-layout-padding">
    <div class="row items-center q-mb-lg">
      <q-btn @click="shuffle" label="Shuffle" />
      <q-toggle v-model="hide" label="Hide" />
    </div>

    <div class="row no-wrap q-col-gutter-x-md" style="height: 300px">
      <q-list class="col-6 full-height scroll">
        <q-intersection
          v-for="item in sortedItems"
          :key="item.id"
          :id="'i-' + item.id"
          class="example-item"
          transition="fade"
        >
          <q-item>
            <q-item-section>
              <q-item-label>Item {{ item.id }}</q-item-label>
              <q-item-label caption>{{item.date.toLocaleString()}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-intersection>
      </q-list>

      <keep-alive>
        <q-list v-if="hide !== true" class="col-6 full-height scroll" key="keepAlive">
          <transition-group name="conversation-item">
            <q-intersection
              v-for="item in sortedItems"
              :key="item.id"
              :id="'i-' + item.id"
              class="example-item"
              transition="fade"
            >
              <q-item>
                <q-item-section>
                  <q-item-label>Item {{ item.id }}</q-item-label>
                  <q-item-label caption>{{item.date.toLocaleString()}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-intersection>
          </transition-group>
        </q-list>
      </keep-alive>
    </div>
  </div>
</template>

<script>
const start = (new Date(2020, 1, 1)).getTime()
const randomDate = () => {
  const end = Date.now()

  return new Date(
    start + Math.random() * (end - start)
  )
}

const items = Array(50).fill().map((_, id) => ({
  id,
  date: randomDate()
}))

export default {
  data () {
    return {
      items,
      hide: false
    }
  },
  computed: {
    sortedItems () {
      return this.items.sort((a, b) => {
        a = new Date(a.date)
        b = new Date(b.date)
        return a > b ? -1 : (a < b ? 1 : 0)
      })
    }
  },
  methods: {
    shuffle () {
      const randomIndex = Math.floor(Math.random() * this.items.length)

      this.items.splice(randomIndex, 1, {
        ...this.items[ randomIndex ],
        date: new Date()
      })
    }
  }
}
</script>

<style lang="sass">
.example-item
  height: 50px
.conversation-item-move
  transition: transform 1.5s
</style>
