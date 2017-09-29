<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">
          Move mouse over the elements below. On a mobile device,
          you need to tap the elements.
        </span>
        <span class="mobile-only">
          Tap on elements below. On desktop you can move the mouse
          over the elements.
        </span>
      </p>

      <div style="margin-top: 40px;width: 200px; height: 70px;background-color: #26A69A;">
        &nbsp;
        <q-tooltip :delay="1000">Quasar Rulz!</q-tooltip>
      </div>

      <q-toggle v-model="toggle" class="z-max fixed-top" />
      <p class="caption">With offset</p>
      <div class="group">
        <q-btn color="indigo">
          Hover
          <q-tooltip v-model="toggle" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>Tooltip</strong> on <em>top</em> (<q-icon name="keyboard_arrow_up" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="red">
          Over
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
            <strong>Tooltip</strong> on <em>right</em> (<q-icon name="keyboard_arrow_right" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="purple">
          These
          <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
            <strong>Tooltip</strong> on <em>left</em> (<q-icon name="keyboard_arrow_left" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="amber">
          Buttons
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
            <strong>Tooltip</strong> on <em>bottom</em> (<q-icon name="keyboard_arrow_down" />)
          </q-tooltip>
        </q-btn>
      </div>

      <q-card style="margin-top: 75px">
        <q-card-title class="bg-primary text-center">
          <q-btn push color="orange">
            Mouse Hover

            <q-tooltip :anchor="anchor" :self="self">
              <div>Quasar is <strong>great</strong>!</div>
              <div class="text-center">Try it.</div>
            </q-tooltip>
          </q-btn>
        </q-card-title>

        <p class="caption text-center">Configure the Tooltip for button above.</p>
        <p class="text-center">
          <q-chip tag color="primary">anchor="{{anchor}}"</q-chip>
          <q-chip tag color="primary">self="{{self}}"</q-chip>
        </p>
        <q-card-main class="row">
          <div class="column items-center col-6">
            <p class="caption">Anchor Origin</p>
            <div class="flex">
              <div class="column group">
                <div>Vertical</div>
                <q-radio v-model="anchorOrigin.vertical" val="top" label="Top" />
                <q-radio v-model="anchorOrigin.vertical" val="center" label="Center" />
                <q-radio v-model="anchorOrigin.vertical" val="bottom" label="Bottom" />
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <q-radio v-model="anchorOrigin.horizontal" val="left" label="Left" />
                <q-radio v-model="anchorOrigin.horizontal" val="middle" label="Middle" />
                <q-radio v-model="anchorOrigin.horizontal" val="right" label="Right" />
              </div>
            </div>
          </div>

          <div class="column items-center col-6">
            <p class="caption">Self Origin</p>
            <div class="flex">
              <div class="column group">
                <div>Vertical</div>
                <q-radio v-model="selfOrigin.vertical" val="top" label="Top" />
                <q-radio v-model="selfOrigin.vertical" val="center" label="Center" />
                <q-radio v-model="selfOrigin.vertical" val="bottom" label="Bottom" />
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <q-radio v-model="selfOrigin.horizontal" val="left" label="Left" />
                <q-radio v-model="selfOrigin.horizontal" val="middle" label="Middle" />
                <q-radio v-model="selfOrigin.horizontal" val="right" label="Right" />
              </div>
            </div>
          </div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false,
      anchorOrigin: {vertical: 'bottom', horizontal: 'middle'},
      selfOrigin: {vertical: 'top', horizontal: 'middle'}
    }
  },
  computed: {
    anchor () {
      return `${this.anchorOrigin.vertical} ${this.anchorOrigin.horizontal}`
    },
    self () {
      return `${this.selfOrigin.vertical} ${this.selfOrigin.horizontal}`
    }
  }
}
</script>
