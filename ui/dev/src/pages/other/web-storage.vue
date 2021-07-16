<template>
  <div class="q-layout-padding">
    <div>{{ storage }}</div>
    <q-btn-group>
      <q-btn label="Toggle test1" @click="toggle('test1')" />
      <q-btn label="Toggle test2" @click="toggle('test2')" />
      <q-btn label="Toggle test3" @click="toggle('test3')" />
      <q-btn label="Clear" @click="clear" />
    </q-btn-group>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  data () {
    return {
      storage: LocalStorage.getAll()
    }
  },
  methods: {
    toggle (key) {
      if (LocalStorage.has(key)) {
        LocalStorage.remove(key)
      }
      else {
        LocalStorage.set(key, `${ key }-value`)
      }
      this.update()
    },
    clear () {
      LocalStorage.clear()
      this.update()
    },
    update () {
      this.storage = LocalStorage.getAll()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.update()
    })
  }
}
</script>
