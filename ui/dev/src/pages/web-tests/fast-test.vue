<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div style="max-width: 600px">
      <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
        <q-tab class="text-purple" name="mails" label="Mails" />
        <q-tab class="text-orange" name="alarms" label="Alarms" />
        <q-tab class="text-teal" name="movies" label="Movies" />
      </q-tabs>

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="tab"
          :animated="false"
          swipeable
          class="bg-purple text-white text-center"
        >
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Ad molestiae non facere animi nobis, similique nemo velit reiciendis
            corporis impedit nam in.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Nostrum necessitatibus expedita dolores? Voluptatem repudiandae
            magni ea.
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <q-btn label="open" @click="open = true" />

    <q-dialog v-model="open">
      <q-card>
        <q-card-section>
          <div class="text-h6">Colors</div>
        </q-card-section>

        <q-card-section>
        <div style="width:40px;height:40px;margin:10px;border: 1px solid black;">
          Color
          <q-popup-proxy ref="pop">
            <q-color v-model="color" @update:model-value="$refs.pop.hide()"></q-color>
          </q-popup-proxy>
        </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { h, ref, computed, watch, nextTick, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'

export default {
  setup () {
    return {
      tab: ref('mails'),
      open: ref(false),
      color: ref('#fff')
    }
  }
}
</script>

<style lang="sass">
</style>
