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
        <q-tooltip>Quasar Rulz!</q-tooltip>
      </div>

      <p class="caption">With offset</p>
      <div class="group">
        <button class="indigo">
          Hover
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, -10]">
            <strong>Tooltip</strong> on <em>top</em> (<i>keyboard_arrow_up</i>)
          </q-tooltip>
        </button>
        <button class="red">
          Over
          <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
            <strong>Tooltip</strong> on <em>right</em> (<i>keyboard_arrow_right</i>)
          </q-tooltip>
        </button>
        <button class="purple">
          These
          <q-tooltip anchor="center left" self="center right" :offset="[-10, 0]">
            <strong>Tooltip</strong> on <em>left</em> (<i>keyboard_arrow_left</i>)
          </q-tooltip>
        </button>
        <button class="amber">
          Buttons
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 10]">
            <strong>Tooltip</strong> on <em>bottom</em> (<i>keyboard_arrow_down</i>)
          </q-tooltip>
        </button>
      </div>

      <div class="card" style="margin-top: 75px">
        <div class="card-title bg-primary text-center">
          <button class="orange push">
            Mouse Hover

            <q-tooltip :anchor="anchor" :self="self">
              <div>Quasar is <strong>great</strong>!</div>
              <div class="text-center">Try it.</div>
            </q-popover>
          </button>
        </div>

        <p class="caption text-center">Configure the Tooltip for button above.</p>
        <p class="text-center">
          <span class="tag label bg-light">anchor="{{anchor}}"</span>
          <span class="tag label bg-light">self="{{self}}"</span>
        </p>
        <div class="card-content group row sm-column">
          <div class="auto column items-center">
            <p class="caption">Anchor Origin</p>
            <div class="flex">
              <div class="column group">
                <div>Vertical</div>
                <label>
                  <q-radio v-model="anchorOrigin.vertical" val="top"></q-radio>
                  Top
                </label>
                <label>
                  <q-radio v-model="anchorOrigin.vertical" val="center"></q-radio>
                  Center
                </label>
                <label>
                  <q-radio v-model="anchorOrigin.vertical" val="bottom"></q-radio>
                  Bottom
                </label>
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <label>
                  <q-radio v-model="anchorOrigin.horizontal" val="left"></q-radio>
                  Left
                </label>
                <label>
                  <q-radio v-model="anchorOrigin.horizontal" val="middle"></q-radio>
                  Middle
                </label>
                <label>
                  <q-radio v-model="anchorOrigin.horizontal" val="right"></q-radio>
                  Right
                </label>
              </div>
            </div>
          </div>

          <div class="auto column items-center">
            <p class="caption">Target Origin</p>
            <div class="flex">
              <div class="column group">
                <div>Vertical</div>
                <label>
                  <q-radio v-model="selfOrigin.vertical" val="top"></q-radio>
                  Top
                </label>
                <label>
                  <q-radio v-model="selfOrigin.vertical" val="center"></q-radio>
                  Center
                </label>
                <label>
                  <q-radio v-model="selfOrigin.vertical" val="bottom"></q-radio>
                  Bottom
                </label>
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <label>
                  <q-radio v-model="selfOrigin.horizontal" val="left"></q-radio>
                  Left
                </label>
                <label>
                  <q-radio v-model="selfOrigin.horizontal" val="middle"></q-radio>
                  Middle
                </label>
                <label>
                  <q-radio v-model="selfOrigin.horizontal" val="right"></q-radio>
                  Right
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
