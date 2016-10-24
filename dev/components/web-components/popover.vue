<template>
  <div>
    <div class="layout-padding">
      <p class="caption" style="margin-top: 120px;">
        Click on buttons and image below to open Popovers.
        <br>
        <em>This page has intended scroll so you can see multiple scenarios.</em>
      </p>

      <div>
        <button ref="target1" class="primary">
          <i>assignment</i>
        </button>
        <quasar-popover anchor-ref="target1" ref="popover1">
          <div class="list highlight" style="min-width: 150px; max-height: 500px;">
            <div
              class="item item-link two-lines item-delimiter"
              v-for="n in 20"
              @click="showToast(), $refs.popover1.close()"
            >
              <div class="item-content">
                <div>Label</div>
                <div>Value</div>
              </div>
            </div>
          </div>
        </quasar-popover>

        <button ref="target4" class="negative">
          Disabled Popover
        </button>
        <quasar-popover anchor-ref="target4" disable>
          This Popover content won't be shown because of "disable"
        </quasar-popover>

        <div class="card" style="margin-top: 75px">
          <div class="card-title bg-primary text-center">
            <button ref="target2" class="orange push">Tap</button>
          </div>
          <quasar-popover
            anchor-ref="target2"
            ref="popover2"
            :anchor-origin="anchorOrigin"
            :target-origin="targetOrigin"
          >
            <div class="list highlight" style="min-width: 100px">
              <div
                class="item item-link item-delimiter"
                v-for="n in 3"
                @click="showToast(), $refs.popover2.close()"
              >
                <div class="item-content">
                  Label
                </div>
              </div>
            </div>
          </quasar-popover>

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

        <br><br>
        <div style="margin-bottom: 700px;">
          <img ref="target3" :src="'statics/map.png'" class="responsive">
          <quasar-popover anchor-ref="target3" ref="popover3" touch-position>
            <div class="list highlight" style="min-width: 200px; max-height: 300px;">
              <div
                class="item item-link item-delimiter"
                v-for="n in 20"
                @click="showToast(), $refs.popover3.close()"
              >
                <i class="item-primary">share</i>
                <div class="item-content">
                  Share
                </div>
              </div>
            </div>
          </quasar-popover>
        </div>

        <button ref="target5" class="secondary absolute-top-right" style="top: 10px; right: 10px; right: 16px;">
          <i>directions</i>
        </button>
        <quasar-popover anchor-ref="target5" ref="popover5">
          <img
            :src="'statics/map.png'"
            style="height: 150px; width: 200px;"
            @click="showToast(), $refs.popover5.close()">
        </quasar-popover>

        <button ref="target6" class="tertiary absolute-bottom-right" style="bottom: 10px; right: 16px;">
          <i>plus_one</i>
        </button>
        <quasar-popover anchor-ref="target6" ref="popover6">
          <div class="group" style="width: 200px; height: 50px; text-align: center;">
            <button class="primary clear" @click="showToast(), $refs.popover6.close()">
              <i>thumb_up</i>
            </button>
            <button class="primary clear" @click="showToast(), $refs.popover6.close()">
              <i>thumb_down</i>
            </button>
            <button class="secondary clear" @click="showToast(), $refs.popover6.close()">
              <i>share</i>
            </button>
          </div>
        </quasar-popover>
      </div>

      <button ref="target7" class="primary absolute-bottom-left" style="bottom: 10px; left: 10px;">
        <i>menu</i>
      </button>
      <quasar-popover anchor-ref="target7" ref="popover7">
        <div class="list highlight" style="min-width: 150px">
          <div
            class="item item-link two-lines item-delimiter"
            v-for="n in 20"
            @click="showToast(), $refs.popover7.close()"
          >
            <div class="item-content">
              <div>Label</div>
              <div>Value</div>
            </div>
          </div>
        </div>
      </quasar-popover>
    </div>
  </div>
</template>

<script>
import { Platform, Toast } from 'quasar'

export default {
  data () {
    return {
      anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
      targetOrigin: {vertical: 'top', horizontal: 'left'}
    }
  },
  methods: {
    showToast () {
      Toast.create((Platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a Popover item')
    }
  }
}
</script>
