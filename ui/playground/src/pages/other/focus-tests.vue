<template>
  <div class="q-layout-padding">
    <div tabindex="0" class="q-pa-lg text-center" style="height: 20vh"
      >Focus placeholder</div
    >
    <q-field label="Field 1 (using q-popup-proxy)">
      <template v-slot:control>
        <div class="self-center full-width no-outline" tabindex="0" />
      </template>
      <q-popup-proxy>
        <q-card>
          <q-card-section>
            Hi from q-popup-proxy
            <div tabindex="0" class="q-pa-lg text-center"
              >Focus placeholder</div
            >
          </q-card-section>
          <q-card-actions>
            <q-btn :type="btnType" v-close-popup autofocus> Close Popup </q-btn>
            <q-btn :type="btnType" @click="show = true"> Open dialog </q-btn>
          </q-card-actions>
        </q-card>
      </q-popup-proxy>
    </q-field>
    <q-field label="Field 1 (using q-menu)">
      <template v-slot:control>
        <div class="self-center full-width no-outline" tabindex="0" />
      </template>
      <q-menu>
        <q-card>
          <q-card-section>
            Hi from q-menu
            <div tabindex="0" class="q-pa-lg text-center"
              >Focus placeholder</div
            >
          </q-card-section>
          <q-card-actions>
            <q-btn :type="btnType" v-close-popup autofocus> Close Menu </q-btn>
            <q-btn :type="btnType" @click="show = true"> Open dialog </q-btn>
          </q-card-actions>
        </q-card>
      </q-menu>
    </q-field>
    <div tabindex="0" class="q-pa-lg text-center" style="height: 20vh"
      >Focus placeholder</div
    >
    <div>
      <q-btn :type="btnType" @click="show = true"> Open dialog </q-btn>

      <q-btn :type="btnType"> Just click </q-btn>

      <q-toggle v-model="show" label="Toggle dialog" />
      <q-toggle v-model="toggle" label="Toggle nothing" />
      <q-checkbox v-model="forceA" :label="forceALabel" />
    </div>
    <div tabindex="0" class="q-pa-lg text-center" style="height: 20vh"
      >Focus placeholder</div
    >
    <div class="row q-gutter-sm">
      <q-input v-model="text" label="QInput" />
      <q-btn
        :type="btnType"
        label="Show QSelect"
        @click="$refs.sel.showPopup()"
      />
      <q-checkbox
        v-model="forceMenu"
        toggle-indeterminate
        :label="forceMenuLabel"
      />
      <q-select
        class="col"
        filled
        ref="sel"
        v-model="model"
        label="QSelect"
        :options="options"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <q-dialog v-model="show">
      <q-card>
        <q-card-section>
          Hi from q-dialog
          <div tabindex="0" class="q-pa-lg text-center">Focus placeholder</div>
          <div tabindex="0" class="q-pa-lg text-center">
            Open popup proxy
            <q-popup-proxy>
              <q-card>
                <q-card-section>
                  Hi from q-popup-proxy
                  <div tabindex="0" class="q-pa-lg text-center"
                    >Focus placeholder</div
                  >
                </q-card-section>
                <q-card-actions>
                  <q-btn :type="btnType" v-close-popup autofocus>
                    Close Popup
                  </q-btn>
                </q-card-actions>
              </q-card>
            </q-popup-proxy>
          </div>
          <div tabindex="0" class="q-pa-lg text-center">
            Open menu
            <q-menu>
              <q-card>
                <q-card-section>
                  Hi from q-menu
                  <div tabindex="0" class="q-pa-lg text-center"
                    >Focus placeholder</div
                  >
                </q-card-section>
                <q-card-actions>
                  <q-btn :type="btnType" v-close-popup autofocus>
                    Close Menu
                  </q-btn>
                </q-card-actions>
              </q-card>
            </q-menu>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn :type="btnType" @click="show = false" autofocus>
            Close Dialog
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const show = ref(false)
const toggle = ref(false)
const forceMenu = ref(false)
const forceA = ref(false)
const model = ref(null)
const options = ref(['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'])
const text = ref('')

const behavior = computed(() =>
  forceMenu.value === null
    ? 'default'
    : forceMenu.value === true
      ? 'menu'
      : 'dialog'
)

const forceMenuLabel = computed(() => {
  if (forceMenu.value === true) {
    return 'Force menu'
  }

  return forceMenu.value === false ? 'Force dialog' : 'Based on platform'
})

const btnType = computed(() => (forceA.value === true ? 'a' : 'button'))

const forceALabel = computed(() =>
  forceA.value === true ? 'Force A' : 'Force Button'
)
</script>
