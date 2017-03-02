<template>
  <div>
    <div class="layout-padding">
      <p class="caption" style="margin-top: 120px;">
        Click on buttons and image below to open Popovers.
        <br>
        <em>This page has intended scroll so you can see multiple scenarios.</em>
      </p>

      <div>
        <q-btn class="primary">
          <i>assignment</i>

          <q-popover ref="popover1">
            <div class="list scroll highlight link delimiter no-border" style="min-width: 150px;">
              <div
                class="item"
                v-for="n in 20"
                @click="showToast(), $refs.popover1.close()"
              >
                <div class="item-content text">
                  <div>Label</div>
                  <div>Value</div>
                </div>
              </div>
            </div>
          </q-popover>
        </q-btn>

        <q-btn ref="target4" class="negative">
          Disabled Popover

          <q-popover disable>
            This Popover content won't be shown because of "disable"
          </q-popover>
        </q-btn>

        <div class="card" style="margin-top: 75px">
          <div class="card-title bg-primary text-center">
            <q-btn class="orange push">
              Tap Me

              <q-popover
                ref="popover2"
                :anchor="anchor"
                :self="self"
              >
                <div class="list highlight link delimiter no-border" style="min-width: 100px">
                  <div
                    class="item"
                    v-for="n in 3"
                    @click="showToast(), $refs.popover2.close()"
                  >
                    <div class="item-content">
                      Label
                    </div>
                  </div>
                </div>
              </q-popover>
            </q-btn>
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
              <p class="caption">Self Origin</p>
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

        <div style="margin-bottom: 700px;"></div>

        <q-btn class="secondary fixed-top-right" style="top: 65px; right: 10px; right: 16px;">
          <i>directions</i>

          <q-popover ref="popover3">
            <img
              src="~assets/map.png"
              style="height: 150px; width: 200px;"
              @click="showToast(), $refs.popover3.close()"
            >
          </q-popover>
        </q-btn>

        <q-btn class="tertiary fixed-bottom-right" style="bottom: 10px; right: 16px;">
          <i>plus_one</i>

          <q-popover ref="popover4">
            <div class="group" style="width: 200px; height: 50px; text-align: center;">
              <q-btn class="primary clear" @click="showToast(), $refs.popover4.close()">
                <i>thumb_up</i>
              </q-btn>
              <q-btn class="primary clear" @click="showToast(), $refs.popover4.close()">
                <i>thumb_down</i>
              </q-btn>
              <q-btn class="secondary clear" @click="showToast(), $refs.popover4.close()">
                <i>share</i>
              </q-btn>
            </div>
          </q-popover>
        </q-btn>
      </div>

      <q-btn class="primary fixed-bottom-left" style="bottom: 10px; left: 10px;">
        <i>menu</i>

        <q-popover ref="popover5">
          <div class="list link delimiter no-border" style="min-width: 150px">
            <div
              class="item"
              v-for="n in 20"
              @click="showToast(), $refs.popover5.close()"
              >
              <div class="item-content text">
                <div>Label</div>
                <div>Value</div>
              </div>
            </div>
          </div>
        </q-popover>
      </q-btn>
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
