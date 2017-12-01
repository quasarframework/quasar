<template>
  <div>
    <div class="layout-padding">
      <p class="caption" style="margin-top: 120px;">
        Click on buttons and image below to open Popovers.
        <br>
        <em>This page has intended scroll so you can see multiple scenarios.</em>
      </p>

      <div>
        <q-toggle v-model="toggle" class="z-max fixed-top" />
        <q-btn color="primary" icon="assignment">
          <q-popover v-model="toggle" ref="popover1">
            <q-list link separator class="scroll" style="min-width: 100px">
              <q-item
                v-for="n in 20"
                :key="n"
                @click="showNotify(), $refs.popover1.hide()"
              >
                <q-item-main label="Label" sublabel="Click me" />
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>

        <q-btn ref="target4" color="negative" label="Disabled Popover">
          <q-popover disable>
            This Popover content won't be shown because of "disable"
          </q-popover>
        </q-btn>

        <q-card style="margin-top: 75px">
          <q-card-title class="bg-primary text-center">
            <q-btn push color="orange" label="Tap Me">
              <q-popover
                ref="popover2"
                :anchor="anchor"
                :self="self"
              >
                <q-list link style="min-width: 100px">
                  <q-item
                    v-for="n in 3"
                    :key="n"
                    @click="showNotify(), $refs.popover2.hide()"
                  >
                    <q-item-main label="Label" />
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </q-card-title>

          <p class="caption text-center">Configure the Popover for button above.</p>
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

        <div style="margin-bottom: 700px;"></div>

        <q-btn color="secondary" class="fixed-top-right" icon="directions" style="top: 65px; right: 16px;">
          <q-popover ref="popover3">
            <img
              src="~assets/map.png"
              style="height: 150px; width: 200px;"
              @click="showNotify(), $refs.popover3.hide()"
            >
          </q-popover>
        </q-btn>

        <q-btn color="tertiary" class="fixed-bottom-right" icon="plus_one" style="bottom: 10px; right: 16px;">
          <q-popover ref="popover4">
            <div class="group" style="width: 220px; text-align: center;">
              <q-btn icon="thumb_up" flat color="primary" @click="showNotify(), $refs.popover4.hide()" />
              <q-btn icon="thumb_down" flat color="primary" @click="showNotify(), $refs.popover4.hide()" />
              <q-btn icon="share" flat color="secondary" @click="showNotify(), $refs.popover4.hide()" />
            </div>
          </q-popover>
        </q-btn>
      </div>

      <q-btn icon="menu" color="primary" class="fixed-bottom-left" style="bottom: 10px; left: 10px;">
        <q-popover ref="popover5">
          <q-list link separator class="scroll" style="min-width: 200px">
            <q-item
              v-for="n in 20"
              :key="n"
              @click="showNotify(), $refs.popover5.hide()"
            >
              <q-item-main label="Label" sublabel="Click me" />
            </q-item>
          </q-list>
        </q-popover>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false,
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
    showNotify () {
      this.$q.notify((this.$q.platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a Popover item')
    }
  }
}
</script>
