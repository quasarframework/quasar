<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div style="width: 300px; height: 180px; background: green;">
      click
      <q-menu
        touch-position
        transition-duration="1000"
      >
        <q-list dense style="min-width: 250px" class="bg-grey text-white">
          <q-item clickable v-close-popup>
            <q-item-section>asdf</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>zxcv</q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <div style="width: 200px; height: 120px; background: blue;">
        <q-menu
          touch-position
        >
          <q-list dense style="min-width: 100px">
            <q-item clickable>
              <q-item-section>qwer</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>close</q-item-section>
            </q-item>
          </q-list>
          <q-btn label="Menu">
            <q-menu>
              <q-list>
                <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                  <q-item-section>Menu Item {{ n }}</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Submenu Label</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top right" self="top left">
                    <q-list>
                      <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                        <q-item-section>Menu Item {{ n }}</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup="2">
                        <q-item-section>Close dialog</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-menu>
      </div>
    </div>

    <div style="width: 300px; height: 180px; background: green; margin-top: 50px" class="main">
      context-menu
      <q-menu
        touch-position
        transition-duration="1000"
        context-menu
      >
        <q-list dense style="min-width: 250px" class="bg-grey text-white">
          <q-item clickable v-close-popup>
            <q-item-section>asdf</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>zxcv</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>1231312</q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <div style="width: 200px; height: 120px; background: blue;" class="secondary">
        <q-menu
          touch-position
          context-menu
        >
          <q-list dense style="min-width: 100px">
            <q-item clickable>
              <q-item-section>qwer</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>close</q-item-section>
            </q-item>
          </q-list>
          <q-btn label="Menu">
            <q-menu>
              <q-list>
                <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                  <q-item-section>Menu Item {{ n }}</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Submenu Label</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top right" self="top left">
                    <q-list>
                      <q-item v-for="n in 5" :key="n" v-close-popup clickable>
                        <q-item-section>Menu Item {{ n }}</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup="2">
                        <q-item-section>Close dialog</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { h, ref, computed, watch, nextTick, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'

export default {
  setup () {
    return {
    }
  }
}
</script>
