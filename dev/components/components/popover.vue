<template>
  <div>
    <div class="layout-padding">
      <p class="caption" style="margin-top: 120px;">
        Click on buttons and image below to open Popovers.
        <br>
        <em>This page has intended scroll so you can see multiple scenarios.</em>
      </p>

      <div>
        <button class="primary">
          <i>assignment</i>

          <quasar-popover ref="popover1">
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
        </button>

        <button ref="target4" class="negative">
          Disabled Popover

          <quasar-popover disable>
            This Popover content won't be shown because of "disable"
          </quasar-popover>
        </button>

        <div class="card" style="margin-top: 75px">
          <div class="card-title bg-primary text-center">
            <button class="orange push">
              Tap

              <quasar-popover
                ref="popover2"
                :anchor="anchor"
                :self="self"
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
            </button>
          </div>

          <p class="caption text-center">Configure the Popover for button above.</p>
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
              <p class="caption">Self Origin</p>
              <div class="flex">
                <div class="column group">
                  <div>Vertical</div>
                  <label>
                    <quasar-radio v-model="selfOrigin.vertical" val="top"></quasar-radio>
                    Top
                  </label>
                  <label>
                    <quasar-radio v-model="selfOrigin.vertical" val="center"></quasar-radio>
                    Center
                  </label>
                  <label>
                    <quasar-radio v-model="selfOrigin.vertical" val="bottom"></quasar-radio>
                    Bottom
                  </label>
                </div>
                <div class="column group">
                  <div>Horizontal</div>
                  <label>
                    <quasar-radio v-model="selfOrigin.horizontal" val="left"></quasar-radio>
                    Left
                  </label>
                  <label>
                    <quasar-radio v-model="selfOrigin.horizontal" val="middle"></quasar-radio>
                    Middle
                  </label>
                  <label>
                    <quasar-radio v-model="selfOrigin.horizontal" val="right"></quasar-radio>
                    Right
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br><br>
        <span>
          <img ref="target3" src="~assets/map.png" class="responsive">
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
        </span>

        <div style="margin-bottom: 700px;"></div>

        <button class="secondary absolute-top-right" style="top: 10px; right: 10px; right: 16px;">
          <i>directions</i>

          <quasar-popover ref="popover5">
            <img
              src="~assets/map.png"
              style="height: 150px; width: 200px;"
              @click="showToast(), $refs.popover5.close()"
            >
          </quasar-popover>
        </button>

        <button class="tertiary absolute-bottom-right" style="bottom: 10px; right: 16px;">
          <i>plus_one</i>

          <quasar-popover ref="popover6">
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
        </button>
      </div>

      <button class="primary absolute-bottom-left" style="bottom: 10px; left: 10px;">
        <i>menu</i>

        <quasar-popover ref="popover7">
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
      </button>
    </div>
  </div>
</template>

<script>
import { Platform, Toast } from 'quasar'

export default {
  data () {
    return {
      anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
      selfOrigin: {vertical: 'top', horizontal: 'left'}
    }
  },
  computed: {
    anchor () {
      return `${this.anchorOrigin.vertical} ${this.anchorOrigin.horizontal}`
    },
    self () {
      return `${this.selfOrigin.vertical} ${this.selfOrigin.horizontal}`
    }
  },
  methods: {
    showToast () {
      Toast.create((Platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a Popover item')
    }
  }
}
</script>
