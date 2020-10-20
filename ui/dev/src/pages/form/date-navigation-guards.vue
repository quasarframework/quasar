<template>
  <div class="q-layout-padding">
    <div class="q-pa-md q-gutter-y-md col" style="max-width: 300px">
      <q-input filled v-model="date" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="date"
                navigation-min-year-month="1989/07"
                navigation-max-year-month="1990/10"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
      </template>
    </q-input>

      <q-input filled v-model="date" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="date"
                navigation-min-year-month="2020/01"
                navigation-max-year-month="2030/07"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
      </template>
    </q-input>

  </div>
</div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      date: null
    }
  }
}
</script>
