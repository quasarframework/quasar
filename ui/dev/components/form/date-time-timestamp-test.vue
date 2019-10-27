<template>
  <div class="q-layout-padding">
    <q-toggle v-model="landscape" label="Landscape" />
    <q-toggle v-model="buttons" label="Buttons" />
    <q-toggle v-model="flatBordered" label="Flat + bordered" />
    <q-toggle v-model="format24h" label="24H format" />

    <div class="text-h6 q-mb-md">
      Mask "x": {{ timestamp }}
    </div>
    <div class="row items-start q-gutter-sm">
      <q-date
        v-model="timestamp"
        :landscape="landscape"
        :flat="flatBordered"
        :bordered="flatBordered"
        today-btn
        mask="x"
      >
        <div v-if="buttons" class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-date>

      <q-time
        v-model="timestamp"
        :landscape="landscape"
        :flat="flatBordered"
        :bordered="flatBordered"
        :format24h="format24h"
        now-btn
        mask="x"
      >
        <div v-if="buttons" class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-time>
    </div>

    <div class="text-h6 q-my-md">
      Mask "YYYY-MM-DD HH:mm:ss": {{ date }}
    </div>
    <div class="row items-start q-gutter-sm">
      <q-date
        v-model="date"
        :landscape="landscape"
        :flat="flatBordered"
        :bordered="flatBordered"
        today-btn
        mask="YYYY-MM-DD HH:mm:ss"
      >
        <div v-if="buttons" class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-date>

      <q-time
        v-model="date"
        :landscape="landscape"
        :flat="flatBordered"
        :bordered="flatBordered"
        :format24h="format24h"
        now-btn
        mask="YYYY-MM-DD HH:mm:ss"
      >
        <div v-if="buttons" class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-time>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timestamp: '1558626538737',
      date: '2019-05-23 19:57:02',

      landscape: false,
      buttons: false,
      flatBordered: false,
      format24h: false
    }
  }
}
</script>
