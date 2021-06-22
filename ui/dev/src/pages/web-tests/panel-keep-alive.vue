<template>
  <div class="q-layout-padding">
    <q-tabs
      v-model="tab"
      active-color="white"
      indicator-color="yellow"
      class="bg-cyan text-white"
      style="margin-bottom: 0"
    >
      <q-tab name="one" icon="phone" label="One" />
      <q-tab name="two" icon="favorite" label="Two" />
      <q-tab name="three" icon="location_on" label="Three" />
      <q-tab disable name="four" icon="map" label="Four" />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      keep-alive
      keep-alive-exclude="three"
      swipeable
      animated
      infinite
      class="text-black text-center"
    >
      <q-tab-panel name="one">
        <keep-alive-test name="one" />
        <q-uploader
          multiple
          color="cyan"
          label="Uploader one"
          url="http://localhost:4444/upload"
        />
        <q-btn dense round icon="map" class="absolute-bottom-right" />
        Tab One <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
      </q-tab-panel>

      <q-tab-panel name="two">
        <keep-alive-test name="two" />
        <q-uploader
          multiple
          color="cyan"
          label="Uploader two"
          url="http://localhost:4444/upload"
        />
        Tab Two <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. At iusto neque odio porro, animi ducimus iure autem commodi sint, magni voluptatum molestias illo accusamus voluptate ratione aperiam. Saepe, fugiat vel.
      </q-tab-panel>

      <q-tab-panel name="three">
        <div class="text-weight-bold">Excluded from keep-alive</div>
        <keep-alive-test name="three" />
        <q-uploader
          multiple
          color="cyan"
          label="Uploader three"
          url="http://localhost:4444/upload"
        />
        Tab Three <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
      </q-tab-panel>

      <q-tab-panel disable name="four">
        <keep-alive-test name="four" />
        <q-uploader
          multiple
          color="cyan"
          label="Uploader four"
          url="http://localhost:4444/upload"
        />
        Tab Four <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { h } from 'vue'

export default {
  components: {
    KeepAliveTest: {
      name: 'KeepAliveTest',

      props: {
        name: String
      },

      created () {
        this.log('created')
      },

      beforeMount () {
        this.log('beforeMount')
      },

      mounted () {
        this.log('mounted')
      },

      beforeUnmount () {
        this.log('beforeUnmount')
      },

      unmounted () {
        this.log('destroyed')
      },

      methods: {
        log (what) {
          console.log(`[KeepAliveTest > ${ this.name }] ${ what }`)
        }
      },

      render () {
        return h('div', [ 'keep alive test ' + this.name ])
      }
    }
  },

  data () {
    return {
      tab: 'one'
    }
  },
  methods: {
  }
}
</script>
