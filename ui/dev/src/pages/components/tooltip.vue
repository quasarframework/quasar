<template>
  <div>
    <div class="q-layout-padding">
      <div class="caption">
        <span class="desktop-only">
          Move mouse over the elements below. On a mobile device,
          you need to touch and hold.
        </span>
        <span class="mobile-only">
          Touch and hold on elements below. On desktop you can move the mouse
          over the elements.
        </span>
      </div>

      <q-toggle v-model="toggle" class="z-max fixed-top-left" />
      <p class="caption">
        With custom offset (18px)
      </p>
      <div class="q-gutter-sm">
        <q-btn color="indigo" label="Hover">
          <q-tooltip v-model="toggle" anchor="top middle" self="bottom middle" :offset="[18, 18]">
            <strong>Tooltip</strong> on <em>top</em> (<q-icon name="keyboard_arrow_up" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="red" label="Over">
          <q-tooltip anchor="center right" self="center left" :offset="[18, 18]">
            <strong>Tooltip</strong> on <em>right</em> (<q-icon name="keyboard_arrow_right" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="purple" label="These">
          <q-tooltip anchor="center left" self="center right" :offset="[18, 18]">
            <strong>Tooltip</strong> on <em>left</em> (<q-icon name="keyboard_arrow_left" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="amber" label="Buttons">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]">
            <strong>Tooltip</strong> on <em>bottom</em> (<q-icon name="keyboard_arrow_down" />)
          </q-tooltip>
        </q-btn>
        <q-btn color="orange" label="With loading" :loading="loading" @click="setLoading">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[18, 18]">
            <strong>Tooltip</strong> on <em>bottom</em> (<q-icon name="keyboard_arrow_down" />)
          </q-tooltip>
        </q-btn>

        <q-toggle v-model="toggleOn" />
        <q-btn color="indigo" label="External Model">
          <q-tooltip :value="toggleOn" :no-parent-event="true" anchor="top middle" self="bottom middle" :offset="[18, 18]" transition-show="flip-right" transition-hide="flip-left">
            <strong>Tooltip</strong> on <em>top</em> (<q-icon name="keyboard_arrow_up" />)
          </q-tooltip>
        </q-btn>
      </div>

      <div class="q-gutter-y-md">
        <q-card style="margin-top: 75px">
          <q-card-section class="bg-primary text-center">
            <q-btn push color="orange" label="Mouse Hover">
              <q-tooltip :anchor="anchor" :self="self">
                <div>Quasar is <strong>great</strong>!</div>
                <div class="text-center">
                  Try it.
                </div>
              </q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section>
            <p class="text-weight-bold text-center q-my-md">
              Configure the Tooltip for button above.
            </p>
            <div class="text-center">
              <q-chip tag color="primary" text-color="white">
                anchor="{{ anchor }}"
              </q-chip>
              <q-chip tag color="primary" text-color="white">
                self="{{ self }}"
              </q-chip>
            </div>
          </q-card-section>

          <q-card-section class="row">
            <div class="column items-center col-6">
              <p class="text-weight-bold">
                Anchor Origin
              </p>
              <div class="flex q-gutter-sm">
                <div class="column">
                  <div>Vertical</div>
                  <q-radio v-model="anchorOrigin.vertical" val="top" label="Top" />
                  <q-radio v-model="anchorOrigin.vertical" val="center" label="Center" />
                  <q-radio v-model="anchorOrigin.vertical" val="bottom" label="Bottom" />
                </div>
                <div class="column">
                  <div>Horizontal</div>
                  <q-radio v-model="anchorOrigin.horizontal" val="left" label="Left" />
                  <q-radio v-model="anchorOrigin.horizontal" val="middle" label="Middle" />
                  <q-radio v-model="anchorOrigin.horizontal" val="right" label="Right" />
                  <q-radio v-model="anchorOrigin.horizontal" val="start" label="Start" />
                  <q-radio v-model="anchorOrigin.horizontal" val="end" label="End" />
                </div>
              </div>
            </div>

            <div class="column items-center col-6">
              <p class="text-weight-bold">
                Self Origin
              </p>
              <div class="flex q-gutter-sm">
                <div class="column">
                  <div>Vertical</div>
                  <q-radio v-model="selfOrigin.vertical" val="top" label="Top" />
                  <q-radio v-model="selfOrigin.vertical" val="center" label="Center" />
                  <q-radio v-model="selfOrigin.vertical" val="bottom" label="Bottom" />
                </div>
                <div class="column">
                  <div>Horizontal</div>
                  <q-radio v-model="selfOrigin.horizontal" val="left" label="Left" />
                  <q-radio v-model="selfOrigin.horizontal" val="middle" label="Middle" />
                  <q-radio v-model="selfOrigin.horizontal" val="right" label="Right" />
                  <q-radio v-model="selfOrigin.horizontal" val="start" label="Start" />
                  <q-radio v-model="selfOrigin.horizontal" val="end" label="End" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mx-auto" style="width: 500px; max-width: 90vw;">
          <q-card-section>
            <div class="q-gutter-sm">
              <q-toggle label="Delay (0.5s)" v-model="delay" :true-value="500" :false-value="0" />
              <q-toggle label="Colored" v-model="color" />
              <q-toggle label="Hiding Delay (1s)" v-model="hdelay" :true-value="1000" :false-value="0" />
            </div>
          </q-card-section>
          <q-img src="https://cdn.quasar.dev/img/material.png" style="height: 100px">
            <q-tooltip
              :delay="delay"
              :hide-delay="hdelay"
              anchor="center middle"
              self="center middle"
              :content-class="color ? 'bg-red' : null"
            >
              Quasar Rulz!
            </q-tooltip>
          </q-img>
        </q-card>

        <q-card class="q-mx-auto" style="width: 500px; max-width: 90vw;">
          <q-card-section>
            <div class="row items-center q-gutter-sm">
              <q-chip square color="primary" text-color="white">
                target
              </q-chip>
              <q-radio v-model="targetEl" :val="false" label="false (no target whatsoever)" />
              <q-radio v-model="targetEl" :val="true" label="true (original parent)" />
              <q-radio v-model="targetEl" val="#target-img-1" label="#target-img-1" />
              <q-radio v-model="targetEl" val="#target-img-2" label="#target-img-2" />
              <q-radio v-model="targetEl" val="#bogus" label="#bogus" />
            </div>
          </q-card-section>
          <q-img src="https://cdn.quasar.dev/img/material.png" id="target-img-1" style="height: 100px">
            <div class="absolute-bottom-right">
              #target-img-1
            </div>
          </q-img>
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" id="target-img-2" style="height: 100px">
            <div class="absolute-bottom-right">
              #target-img-2
            </div>
          </q-img>
          <q-img src="https://cdn.quasar.dev/img/blueish.jpg" style="height: 100px">
            <div class="absolute-bottom-right">
              Original parent
            </div>
            <q-tooltip
              :target="targetEl"
              anchor="center middle"
              self="center middle"
            >
              Quasar Rulz!
            </q-tooltip>
          </q-img>
        </q-card>

        <q-card class="q-mx-auto" style="width: 500px; max-width: 90vw;">
          <q-card-section>
            <q-toggle v-model="vIfTest" label="v-if test" />
          </q-card-section>
          <q-img src="https://cdn.quasar.dev/img/material.png" style="height: 100px" v-if="vIfTest">
            <div class="absolute-bottom-right">
              attached to q-img
            </div>
            <q-tooltip anchor="center middle" self="center middle">
              Quasar Rulz!
            </q-tooltip>
          </q-img>
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" style="height: 100px">
            <div class="absolute-bottom-right">
              attached to q-tooltip
            </div>
            <q-tooltip v-if="vIfTest" anchor="center middle" self="center middle">
              Quasar Rulz!
            </q-tooltip>
          </q-img>
        </q-card>
      </div>

      <div style="margin-bottom: 700px;" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: true,
      toggleOn: true,
      loading: false,
      delay: 500,
      hdelay: 1000,
      vIfTest: true,
      color: true,
      anchorOrigin: { vertical: 'bottom', horizontal: 'middle' },
      selfOrigin: { vertical: 'top', horizontal: 'middle' },
      targetEl: '#target-img-1'
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
    setLoading () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>
