<template>
  <div style="padding: 25px">
    <q-toggle v-model="toggle" label="Show" />
    <q-btn-dropdown v-model="toggle" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
      <q-list link>
        <q-list-header inset>Folders X</q-list-header>
        <q-item v-for="n in 3" :key="`x.${n}`" @click.native="toggle = false">
          <q-item-side icon="folder" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Photos</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          <q-item-side right icon="info" />
        </q-item>
        <q-item-separator inset />
        <q-list-header inset>Files</q-list-header>
        <q-item v-for="n in 3" :key="`y.${n}`" @click.native="toggle = false">
          <q-item-side icon="assignment" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Vacation</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          <q-item-side right icon="info" />
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div v-for="(cfg, index1) in conf" :key="`${cfg.split}-${cfg.dense}-${cfg.disable}`">
      <div v-for="(size, index2) in sizes" :key="size">
        <p class="caption">{{ label(cfg) }} - {{ size }}</p>
        text
        <q-btn :size="size" color="primary" glossy :dense="cfg.dense" :disable="cfg.disable" label="Test" />
        <q-btn-dropdown ref="first" :size="size" :split="cfg.split" :dense="cfg.dense" :disable="cfg.disable" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders X</q-list-header>
            <q-item v-for="n in 3" :key="`1.${n}`" @click.native="hideDropdown(index1 * 3 + index2)">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="`2.${n}`" @click.native="$refs.first[index1 * 3 + index2].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="second" :size="size" :split="cfg.split" :dense="cfg.dense" :disable="cfg.disable" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" icon="map" glossy label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="`1.${n}`" @click.native="$refs.second[index1 * 3 + index2].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="`2.${n}`" @click.native="$refs.second[index1 * 3 + index2].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="third" :size="size" :split="cfg.split" :dense="cfg.dense" :disable="cfg.disable" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" icon="map" glossy style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="`1.${n}`" @click.native="$refs.third[index1 * 3 + index2].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="`2.${n}`" @click.native="$refs.third[index1 * 3 + index2].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="fourth" :size="size" :split="cfg.split" :dense="cfg.dense" :disable="cfg.disable" @show="log('open')" @hide="log('close')" @click="log('click')" color="yellow" glossy icon="map" label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="`1.${n}`" @click.native="$refs.fourth[index1 * 3 + index2].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="`2.${n}`" @click.native="$refs.fourth[index1 * 3 + index2].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    
    <p class="caption">Empty label reactivity problem. Label should be {{ labelA }}</p>
    <div class="q-ma-md">
      <q-btn-dropdown @click="labelA+='+'" :label="labelA"></q-btn-dropdown>
    </div>
  
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false,
      conf: [
        {split: false, dense: false, disable: false},
        {split: false, dense: true, disable: false},
        {split: true, dense: false, disable: false},
        {split: true, dense: true, disable: false},
        {split: false, dense: false, disable: true},
        {split: false, dense: true, disable: true},
        {split: true, dense: false, disable: true},
        {split: true, dense: true, disable: true}
      ],
      sizes: ['sm', 'md', 'lg'],
      labelA: ''
    }
  },
  methods: {
    log (evt) {
      console.log(evt)
    },
    label (cfg) {
      let label = 'QBtnDropdown'
      if (cfg.split) {
        label += ' Split'
      }
      if (cfg.dense) {
        label += ' dense'
      }
      if (cfg.disable) {
        label += ' disable'
      }
      return label
    },
    hideDropdown (index) {
      console.log(this.$refs)
      this.$refs.first[index].hide()
    }
  }
}
</script>
