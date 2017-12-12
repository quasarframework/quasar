<template>
  <div style="padding: 25px">
    <div v-for="(cfg, index) in conf" :key="`${cfg.split}-${cfg.compact}`">
      <div v-for="size in sizes" :key="size">
        <p class="caption">{{ label(cfg) }} - {{ size }}</p>
        <q-btn-dropdown ref="first" :size="size" :split="cfg.split" :compact="cfg.compact" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" glossy label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders X</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="hideDropdown(index)">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.first[index].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="second" :size="size" :split="cfg.split" :compact="cfg.compact" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" icon="map" glossy label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.second[index].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.second[index].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="third" :size="size" :split="cfg.split" :compact="cfg.compact" @show="log('open')" @hide="log('close')" @click="log('click')" color="primary" icon="map" glossy style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.third[index].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.third[index].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown ref="fourth" :size="size" :split="cfg.split" :compact="cfg.compact" @show="log('open')" @hide="log('close')" @click="log('click')" color="yellow" glossy icon="map" label="Dropdown Button" style="margin: 15px">
          <q-list link>
            <q-list-header inset>Folders</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.fourth[index].hide()">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="n" @click="$refs.fourth[index].hide()">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              </q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      conf: [
        {split: false, compact: false},
        {split: false, compact: true},
        {split: true, compact: false},
        {split: true, compact: true}
      ],
      sizes: ['sm', 'md', 'lg']
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
      if (cfg.compact) {
        label += ' Compact'
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
