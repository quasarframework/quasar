<template>
  <div>
    <div class="q-layout-padding">
      <div class="row justify-center">
        <div class="q-pa-md col-12-sm col-8-md col-6-lg" style="max-width: 600px; width: 100%;">
          QSkeleton is a responsive SVG-based component that allows you to have skeleton placeholders with option to display right-to-left (rtl prop).
          Easily customizable if you know SVG. Otherwise, there are several pre-made components that you can use.
          <h4>Basic</h4>
          <q-skeleton />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Bullet List</h4>
          <q-skeleton-bullet-list />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-bullet-list rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Code</h4>
          <q-skeleton-code />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-code rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Facebook</h4>
          <q-skeleton-facebook />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-facebook rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Instagram</h4>
          <q-skeleton-instagram />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-instagram rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Linkedin</h4>
          <q-skeleton-linkedin />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-linkedin rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Table</h4>
          <q-skeleton-table />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-table rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Twitch</h4>
          <q-skeleton-twitch />
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton-twitch rtl />
          <q-separator color="blue" class="q-mb-md" />

          <h4>Customizing</h4>
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton :width="computedWidth" :height="computedHeight">
            <template v-for="r in rows">
              <template v-for="c in columns">
                <rect :key="r + '_' + c" :x="xPos(c)" :y="yPos(r)" rx="3" ry="3" :width="90" :height="90" />
              </template>
            </template>
          </q-skeleton>
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton :width="computedWidth" :height="computedHeight" style="--skeleton-primary-color: #FF0000; --skeleton-secondary-color: #00FF00">
            <template v-for="r in rows">
              <template v-for="c in columns">
                <rect :key="r + '_' + c" :x="xPos(c)" :y="yPos(r)" rx="3" ry="3" :width="90" :height="90" />
              </template>
            </template>
          </q-skeleton>
          <q-separator color="blue" class="q-mb-md" />
          <q-skeleton rtl :width="computedWidth" :height="computedHeight" style="--skeleton-primary-color: #FF0000; --skeleton-secondary-color: #00FF00">
            <template v-for="r in rows">
              <template v-for="c in columns">
                <rect :key="r + '_' + c" :x="xPos(c)" :y="yPos(r)" rx="3" ry="3" :width="90" :height="90" />
              </template>
            </template>
          </q-skeleton>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rows: 5,
      columns: 5
    }
  },

  computed: {
    computedWidth () {
      return this.rows * 100
    },
    computedHeight () {
      return this.columns * 100 - 10
    }
  },

  methods: {
    xPos (column) {
      return 5 + ((column - 1) * 100)
    },
    yPos (row) {
      return (row - 1) * 100
    }
  }
}
</script>
