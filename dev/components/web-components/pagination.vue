<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{page}}</em></span>
      </div>

      <p class="caption">
        You can also
        <span class="desktop-only">click</span>
        <span class="mobile-only">tap</span>
        on the Input box and type out another page number
        then hit &lt;ENTER&gt;
      </p>

      <quasar-pagination v-model="page" :max="17"></quasar-pagination>

      <p class="caption">Disabled State</p>
      <quasar-pagination v-model="page" :max="17" disable></quasar-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 1
    }
  }
}
</script>
