<template>
  <div class="q-layout-padding">
    <q-btn @click="shuffle" class="q-mb-lg" label="Shuffle" />

    <div class="row no-wrap q-col-gutter-x-md" style="height: 300px">
      <q-list class="col full-height scroll">
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

      <q-list class="col full-height scroll">
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
    </div>
  </div>
</template>

<script>
const start = (new Date(2020, 1, 1)).getTime();
const randomDate = () => {
  const end = Date.now();

  return new Date(
    start + Math.random() * (end - start)
  );
}

const items = Array(50).fill().map((_, id) => ({
  id,
  date: randomDate()
}))

export default {
  data: function() {
    return {
      items
    }
  },
  computed: {
    sortedItems() {
      return this.items.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : (a < b ? 1 : 0);
      });
    }
  },
  methods: {
    shuffle: function() {
      const randomIndex = Math.floor(Math.random() * this.items.length)

      this.items.splice(randomIndex, 1, {
        ...this.items[randomIndex],
        date: new Date()
      })
    }
  }
}
</script>

<style lang="stylus">
.example-item
  height: 50px
.conversation-item-move
  transition: transform 1.5s
</style>
