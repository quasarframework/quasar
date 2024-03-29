<template>
  <q-layout view="lHh lpr fFf">
    <q-header :model-value="header">
      <q-toolbar>
        <q-toolbar-title>Pull To Refresh - Header</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer :model-value="footer">
      <q-toolbar>
        <q-toolbar-title>Pull To Refresh - Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <q-page padding class="bg-orange-4" :class="{ 'column no-wrap no-height': hasScroll }">
          <div class="bg-green-4 q-pa-md text-center" v-show="guardTop">
            Guarding text above QPullToRefresh
          </div>
          <component :is="scrollArea ? 'QScrollArea' : 'div'" :class="scrollClass">
            <q-pull-to-refresh
              ref="pull"
              color="primary"
              @refresh="refresh"
              :disable="disable"
            >
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                label="Test options scroll"
              />

              <div class="bg-white overflow-hidden-y">
                <div>
                  <div class="caption bg-yellow-6">
                    Pull down to refresh on the content below.
                    On desktop it works by dragging the content down.
                  </div>

                  <div class="caption bg-yellow-6">
                    <q-toggle v-model="header" label="Show Header" />
                    <q-toggle v-model="footer" label="Show Footer" />
                    <q-toggle v-model="guardTop" label="Show Top Guard" />
                    <q-toggle v-model="guardBottom" label="Show Bottom Guard" />
                    <q-toggle v-model="disable" label="Disable" />
                    <q-toggle v-model="scroll" label="Scroll" />
                    <q-toggle v-model="scrollArea" label="QScrollArea" />
                  </div>

                  <div class="bg-yellow-6 q-mx-md">
                    <q-select
                      v-model="selectModel"
                      :options="selectOptions"
                      label="Test options scroll"
                    />
                  </div>
                </div>

                <div v-for="(item, index) in items" :key="index" class="caption bg-yellow-6">
                  <q-chip square color="secondary" class="shadow-1">
                    {{ items.length - index }}
                  </q-chip>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </div>
              </div>
            </q-pull-to-refresh>
          </component>
          <div class="bg-green-4 q-pa-md text-center" v-show="guardBottom">
            Guarding text below QPullToRefresh
          </div>
        </q-page>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.no-height
  height: 0
</style>

<script>
export default {
  data () {
    return {
      items: [ {}, {}, {}, {}, {}, {}, {}, {}, {} ],
      guardTop: true,
      guardBottom: true,
      header: true,
      footer: true,
      disable: false,
      scroll: false,
      scrollArea: false,
      selectModel: null,
      selectOptions: Array(50).fill(null).map((_, index) => `Option ${ index + 1 }`)
    }
  },
  watch: {
    scroll () {
      this.$nextTick(() => {
        this.$refs.pull.updateScrollTarget()
      })
    },
    scrollArea () {
      this.$nextTick(() => {
        this.$refs.pull.updateScrollTarget()
      })
    }
  },
  computed: {
    hasScroll () {
      return this.scroll || this.scrollArea
    },
    scrollClass () {
      if (this.scrollArea) {
        return 'col'
      }
      return this.scroll ? 'scroll' : null
    }
  },
  methods: {
    refresh (done) {
      setTimeout(() => {
        this.items.push({})
        this.$q.notify('Item #' + this.items.length + ' is new.')
        done()
      }, 1000)
    },
    test (evt) {
      evt.stopPropagation()
      console.log('test', evt)
    }
  }
}
</script>
