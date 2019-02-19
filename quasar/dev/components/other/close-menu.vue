<template>
  <div class="q-layout-padding q-gutter-sm">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-btn color="primary" icon="map">
      <q-menu>
        <q-list separator class="scroll" style="min-width: 100px">
          <!--<q-item
            v-close-overlay
            @click.native="showNotify"
          >
            <q-item-main label="Closable" sublabel="Closes" />
          </q-item>-->
          <q-btn color="primary" v-close-menu label="Shut up" icon="map" />
          <q-item clickable @click="showNotify">
            <q-item-section>
              <q-item-label>Does nothing</q-item-label>
              <q-item-label caption>
                Sublabel
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn color="primary" icon="map" :label="menu ? 'yes' : 'no'">
      <q-menu v-model="menu">
        <q-list link separator class="scroll" style="min-width: 100px">
          <q-btn color="primary" v-close-menu label="X Shut up" icon="map" @click="showNotify" />
          <q-item clickable @click="showNotify">
            <q-item-section>
              <q-item-label>X Does nothing</q-item-label>
              <q-item-label caption>
                sublabel
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: false
    }
  },
  methods: {
    showNotify () {
      console.log('@click')
    }
  }
}
</script>
