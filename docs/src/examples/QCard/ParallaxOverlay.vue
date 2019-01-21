<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card dark class="bg-blue-grey-9">

      <q-parallax src="https://cdn.quasar-framework.org/img/parallax1.jpg" :height="200">
        <div class="absolute-bottom q-pa-sm" style="background: rgba(0,0,30,0.6)">
          <div class="text-h6 text-right text-white">Our Changing Planet</div>
          <div class="text-subtitle2 text-right text-white">by Kurt Wagner</div>
        </div>
      </q-parallax>
      <q-separator />

      <q-card-actions>
        <q-btn flat>Read Now</q-btn>
        <q-btn flat>Bookmark</q-btn>
        <q-space spaced />
        <q-btn color="green-2" icon="cloud_download" flat label="Download" />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tab: 'one',
      stars: 3
    }
  }
}
</script>
