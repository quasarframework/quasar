<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-btn color="primary" icon="map">
      <q-popover>
        <q-list link separator class="scroll" style="min-width: 100px">
          <!--<q-item
            v-close-overlay
            @click.native="showNotify"
          >
            <q-item-main label="Closable" sublabel="Closes" />
          </q-item>-->
          <q-btn color="primary" v-close-overlay label="Shut up" icon="map" />
          <q-item
            @click.native="showNotify"
          >
            <q-item-main label="Does nothing" sublabel="sublabel" />
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>

    <q-btn color="primary" icon="map" :label="popover ? 'yes' : 'no'">
      <q-popover v-model="popover">
        <q-list link separator class="scroll" style="min-width: 100px">
          <q-btn color="primary" v-close-overlay label="X Shut up" icon="map" @click.native="showNotify" />
          <q-item @click.native="showNotify">
            <q-item-main label="X Does nothing" sublabel="sublabel" />
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>




  </div>
</template>

<script>
export default {
  data () {
    return {
      popover: false
    }
  },
  methods: {
    showNotify () {
      console.log('@click')
    }
  }
}
</script>
