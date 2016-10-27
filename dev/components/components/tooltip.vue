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
        <quasar-tooltip>
          Quasar Rulz!
        </quasar-tooltip>
      </div>
      <br><br>
      <div class="group">
        <button class="indigo">
          Hover
          <quasar-tooltip>
            Quasar Tooltip 1
          </quasar-tooltip>
        </button>
        <button class="red">
          Over
          <quasar-tooltip>
            Quasar Tooltip 2
          </quasar-tooltip>
        </button>
        <button class="purple">
          These
          <quasar-tooltip>
            Quasar Tooltip 3
          </quasar-tooltip>
        </button>
        <button class="amber">
          Buttons
          <quasar-tooltip>
            Quasar Tooltip 4
          </quasar-tooltip>
        </button>
      </div>

      <div class="card" style="margin-top: 75px">
        <div class="card-title bg-primary text-center">
          <button class="orange push">
            Mouse Hover

            <quasar-tooltip
              :anchor-origin="anchorOrigin"
              :target-origin="targetOrigin"
            >
              <div>Quasar is <strong>great</strong>!</div>
              <div class="text-center">Try it.</div>
            </quasar-popover>
          </button>
        </div>

        <p class="caption text-center">Configure the Popover for button above.</p>
        <div class="card-content group row sm-column">
          <div class="auto column items-center">
            <p class="caption">Anchor Origin</p>
            <div class="flex">
              <div class="column group">
                <div>Vertical</div>
                <label>
                  <quasar-radio v-model="anchorOrigin.vertical" val="top"></quasar-radio>
                  Top
                </label>
                <label>
                  <quasar-radio v-model="anchorOrigin.vertical" val="center"></quasar-radio>
                  Center
                </label>
                <label>
                  <quasar-radio v-model="anchorOrigin.vertical" val="bottom"></quasar-radio>
                  Bottom
                </label>
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <label>
                  <quasar-radio v-model="anchorOrigin.horizontal" val="left"></quasar-radio>
                  Left
                </label>
                <label>
                  <quasar-radio v-model="anchorOrigin.horizontal" val="middle"></quasar-radio>
                  Middle
                </label>
                <label>
                  <quasar-radio v-model="anchorOrigin.horizontal" val="right"></quasar-radio>
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
                  <quasar-radio v-model="targetOrigin.vertical" val="top"></quasar-radio>
                  Top
                </label>
                <label>
                  <quasar-radio v-model="targetOrigin.vertical" val="center"></quasar-radio>
                  Center
                </label>
                <label>
                  <quasar-radio v-model="targetOrigin.vertical" val="bottom"></quasar-radio>
                  Bottom
                </label>
              </div>
              <div class="column group">
                <div>Horizontal</div>
                <label>
                  <quasar-radio v-model="targetOrigin.horizontal" val="left"></quasar-radio>
                  Left
                </label>
                <label>
                  <quasar-radio v-model="targetOrigin.horizontal" val="middle"></quasar-radio>
                  Middle
                </label>
                <label>
                  <quasar-radio v-model="targetOrigin.horizontal" val="right"></quasar-radio>
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
      anchorOrigin: {vertical: 'top', horizontal: 'middle'},
      targetOrigin: {vertical: 'bottom', horizontal: 'middle'}
    }
  }
}
</script>
