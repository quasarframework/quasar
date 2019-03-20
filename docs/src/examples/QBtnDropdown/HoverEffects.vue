<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" label="Dropdown Button" v-model="menu" @mouseover.native="menuOver = true" @mouseout.native="menuOver = false">
      <q-list @mouseover.native="listOver = true" @mouseout.native="listOver = false">
        <q-item v-close-popup clickable>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-close-popup clickable>
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-close-popup clickable>
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { debounce } from 'quasar'
export default {
  data () {
    return {
      menu: false,
      menuOver: false,
      listOver: false,
      debounceMenu: null
    }
  },
  mounted () {
    this.debounceMenu = debounce(() => {
      this.checkMenu()
    }, 300)
  },
  methods: {
    onItemClick () {
      console.log('Clicked on an Item')
    },
    checkMenu () {
      if (this.menuOver || this.listOver) {
        this.menu = true
      }
      else {
        this.menu = false
      }
    }
  },
  watch: {
    menuOver (val) {
      this.debounceMenu()
    },
    listOver (val) {
      this.debounceMenu()
    }
  }
}
</script>
