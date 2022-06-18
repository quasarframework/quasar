<template>
  <div class="q-layout-padding">
    <div class="row no-wrap q-col-gutter-x-md">
      <div v-for="type in ['a', 'button']" :key="type" class="col q-gutter-y-md">
        <div v-for="(prop, i) in props" :key="i" class="q-gutter-y-md">
          <div class="row q-gutter-md items-start">
            <q-btn :type="type" v-bind="prop" label="xs" size="xs" color="primary" />
            <q-btn :type="type" v-bind="prop" label="sm" size="sm" color="primary" />
            <q-btn :type="type" v-bind="prop" label="md" size="md" color="primary" />
            <q-btn :type="type" v-bind="prop" label="lg" size="lg" color="primary" />
            <q-btn :type="type" v-bind="prop" label="xl" size="xl" color="primary" />
          </div>
          <div class="row q-gutter-md items-center">
            <q-btn :type="type" v-bind="prop" label="xs" size="xs" color="primary" />
            <q-btn :type="type" v-bind="prop" label="sm" size="sm" color="primary" />
            <q-btn :type="type" v-bind="prop" label="md" size="md" color="primary" />
            <q-btn :type="type" v-bind="prop" label="lg" size="lg" color="primary" />
            <q-btn :type="type" v-bind="prop" label="xl" size="xl" color="primary" />
          </div>
          <div class="row q-gutter-md">
            <q-btn :type="type" v-bind="prop" stretch label="xs stretch" size="xs" color="primary" />
            <q-btn :type="type" v-bind="prop" stretch label="sm stretch" size="sm" color="primary" />
            <q-btn :type="type" v-bind="prop" stretch label="md stretch" size="md" color="primary" />
            <q-btn :type="type" v-bind="prop" stretch label="lg stretch" size="lg" color="primary" />
            <q-btn :type="type" v-bind="prop" stretch label="xl stretch" size="xl" color="primary" />
          </div>
          <div class="row q-gutter-md items-center">
            <q-btn :type="type" v-bind="prop" round icon="clear" color="primary">
              <q-badge color="orange" floating>
                22
              </q-badge>
            </q-btn>
            <q-btn :type="type" v-bind="prop" round icon="clear" size="xs" color="primary" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="sm" color="primary" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="md" color="primary" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="lg" color="primary" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="xl" color="primary" />

            <q-btn :type="type" v-bind="prop" round dense icon="clear" color="primary" />
            <q-btn :type="type" v-bind="prop" round dense icon="clear" size="xl" color="primary" />

            <q-btn :type="type" v-bind="prop" round icon="clear" color="primary" class="q-pa-xl" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="xs" color="primary" class="q-pa-xl" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="sm" color="primary" class="q-pa-xl" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="md" color="primary" class="q-pa-xl" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="lg" color="primary" class="q-pa-xl" />
            <q-btn :type="type" v-bind="prop" round icon="clear" size="xl" color="primary" class="q-pa-xl" />

            <q-btn :type="type" v-bind="prop" icon="clear" color="primary" />
            <q-btn :type="type" v-bind="prop" icon="clear" color="primary" loading />
            <q-btn :type="type" v-bind="prop" icon="clear" color="primary" style="max-width: 0; min-height: 0" />

            <q-btn :type="type" v-bind="prop" dense icon="clear" color="primary" />
            <q-btn :type="type" v-bind="prop" dense icon="clear" color="primary" style="max-width: 0; min-height: 0" />

            <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" />
            <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" loading />

            <q-btn :type="type" v-bind="prop" label="Label" color="primary" />
            <q-btn :type="type" v-bind="prop" label="Label" size="sm" no-caps color="primary" />
            <q-btn :type="type" v-bind="prop" label="Label" size="sm" no-caps color="primary" style="height: 6em" />

            <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" stack />
            <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" stack loading />

            <q-btn :type="type" v-bind="prop" icon="clear" label="Long label. Long label. Long label. Long label. Long label." color="primary" no-wrap />
            <q-btn :type="type" v-bind="prop" icon="clear" label="Long label. Long label. Long label. Long label. Long label." color="primary" stack no-wrap />

            <q-btn :type="type" v-bind="prop" color="deep-orange">
              <div class="row items-center no-wrap">
                <q-icon left name="map" />
                <div class="text-center">
                  Custom<br>Content<br>With Menu
                </div>
              </div>
              <q-menu fit>
                <div class="bg-white text-black q-pa-lg text-center">
                  Menu
                </div>
              </q-menu>
            </q-btn>

            <q-btn :type="type" v-bind="prop" color="indigo" no-caps>
              Multiline<br>Button<br>With Tooltip
              <q-tooltip>
                Tooltip
              </q-tooltip>
            </q-btn>

            <q-btn
              :type="type"
              v-bind="prop"
              size="22px"
              class="q-px-xl q-py-xs"
              color="purple"
              label="Custom"
            />

            <q-btn :type="type" v-bind="prop" color="deep-orange" style="height: 10em">
              <div class="row items-center no-wrap">
                <q-icon left name="map" />
                <div class="text-center">
                  Custom<br>Content
                </div>
              </div>
            </q-btn>

            <q-btn :type="type" v-bind="prop" color="indigo" no-caps style="height: 10em">
              Multiline<br>Button
            </q-btn>

            <q-btn :type="type" v-bind="prop" color="indigo" no-caps style="height: 10em">
              Multiline<br>Button
              <q-badge color="orange" floating>
                22
              </q-badge>
            </q-btn>

            <q-btn
              :type="type"
              v-bind="prop"
              size="22px"
              class="q-px-xl q-py-xs"
              color="purple"
              label="Custom"
              style="height: 10em"
            />

            <q-btn :type="type" v-bind="prop" :loading="loading" :percentage="percentage" color="primary" @click="startProgress">
              Btn with progress
              <template v-slot:loading>
                <div class="row items-center">
                  <q-spinner class="on-left" />
                  Computing...
                </div>
              </template>
            </q-btn>

            <q-btn :type="type" v-bind="prop" round :loading="loading" :percentage="percentage" color="primary" @click="startProgress" icon="wifi" />
          </div>

          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" size="xs" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" size="xl" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width q-pa-xl" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" size="xs" class="full-width q-pa-xl" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" size="xl" class="full-width q-pa-xl" />
          <q-btn :type="type" v-bind="prop" dense icon="clear" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" dense icon="clear" label="Label" color="primary" class="full-width q-pa-xl" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="right" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" align="right" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="right" />

          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" style="height: 6em" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="left" style="height: 6em" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="right" style="height: 6em" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" style="height: 6em" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="left" style="height: 6em" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="right" style="height: 6em" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      props: [
        {},
        { push: true },
        { outline: true },
        { unelevated: true },
        { flat: true },
        { rounded: true },
        { rounded: true, push: true },
        { rounded: true, outline: true },
        { rounded: true, unelevated: true },
        { rounded: true, flat: true }
      ],
      loading: false,
      percentage: 0
    }
  },

  methods: {
    startProgress () {
      this.percentage = 0
      this.loading = true
      this.interval = setInterval(() => {
        this.percentage += Math.floor(Math.random() * 8 + 2)
        if (this.percentage >= 100) {
          this.percentage = 0
          clearInterval(this.interval)
          this.loading = false
        }
      }, 700)
    }
  },

  beforeUnmount () {
    clearInterval(this.interval)
  }
}
</script>
