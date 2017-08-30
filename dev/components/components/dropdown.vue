<template>
  <div class="row items-center">
    <q-btn color="primary" icon="map" glossy style="margin: 25px">
      Click me
    </q-btn>

    <q-btn-toggle
      v-model="toggle"
      toggle-color="primary"
      icon="map"
    >
      Toggle
    </q-btn-toggle>

    <q-btn-dropdown ref="dd" :split="toggle" @open="log('open')" @close="log('close')" @click="log('click')" color="primary" icon="map" glossy label="Click me" style="margin: 25px">
      <q-list link>
        <q-list-header inset>Folders</q-list-header>
        <q-item v-for="n in 3" :key="n" @click="$refs.dd.close()">
          <q-item-side icon="folder" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Photos</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
        <q-item-separator inset />
        <q-list-header inset>Files</q-list-header>
        <q-item v-for="n in 3" :key="n" @click="$refs.dd.close()">
          <q-item-side icon="assignment" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Vacation</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown ref="dd2" :split="toggle" @open="log('open')" @close="log('close')" @click="log('click')" color="yellow" glossy icon="map" label="Click me" style="margin: 25px">
      <q-list link>
        <q-list-header inset>Folders</q-list-header>
        <q-item v-for="n in 3" :key="n" @click="$refs.dd2.close()">
          <q-item-side icon="folder" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Photos</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
        <q-item-separator inset />
        <q-list-header inset>Files</q-list-header>
        <q-item v-for="n in 3" :key="n" @click="$refs.dd2.close()">
          <q-item-side icon="assignment" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Vacation</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <br><br><q-toggle v-model="toggle" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false
    }
  },
  methods: {
    log (evt) {
      console.log(evt)
    }
  }
}
</script>
