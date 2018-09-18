<template>
  <div class="layout-padding">
    <q-jumbotron>
      <div class="text-h3">Hello, world!</div>
      <div class="text-body1 q-mt-md">
        This is a simple hero unit, a simple jumbotron-style component for calling extra
        attention to featured content or information.
      </div>
      <q-separator class="q-my-lg" />
      <div class="text-subtitle2 q-mb-md">Check out Quasar Framework components.</div>
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Learn more" />
    </q-jumbotron>

    <q-jumbotron class="bg-primary text-white">
      <div class="text-h3">Hello, world!</div>
      <div class="text-body1 q-mt-md">
        This is a simple hero unit, a simple jumbotron-style component for calling extra
        attention to featured content or information.
      </div>
      <q-separator class="q-my-lg" dark />
      <div class="text-subtitle2 q-mb-md">Check out Quasar Framework components.</div>
      <q-btn color="white" text-color="primary" class="q-py-sm q-px-xl" label="Learn more" />
    </q-jumbotron>

    <div class="q-pa-md q-pt-xl q-mb-md bg-black">
      <q-jumbotron class="bg-grey-8 text-white">
        <div class="text-h3">Hello, world!</div>
        <div class="text-body1 q-mt-md">
          This is a simple hero unit, a simple jumbotron-style component for calling extra
          attention to featured content or information.
        </div>
        <q-separator class="q-my-lg" dark />
        <div class="text-subtitle2 q-mb-md">Check out Quasar Framework components.</div>
        <q-btn color="black" class="q-py-sm q-px-xl" label="Learn more" />
      </q-jumbotron>
    </div>

    <q-jumbotron gradient="circle, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%">
      <div class="text-h3">Hello, world!</div>
      <div class="text-body1 q-mt-md">
        This is a simple hero unit, a simple jumbotron-style component for calling extra
        attention to featured content or information.
      </div>
      <q-separator class="q-my-lg" dark />
      <div class="text-subtitle2 q-mb-md">Check out Quasar Framework components.</div>
      <q-btn color="secondary" class="q-py-sm q-px-xl" label="Learn more" />
    </q-jumbotron>

    <q-jumbotron class="text-white" img-src="statics/parallax2.jpg">
      <div class="text-h3">Hello, world!</div>
      <div class="text-body1 q-mt-md">
        This is a simple hero unit, a simple jumbotron-style component for calling extra
        attention to featured content or information.
      </div>
      <q-separator class="q-my-lg" dark />
      <div class="text-subtitle2 q-mb-md">Check out Quasar Framework components.</div>
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Learn more" />
    </q-jumbotron>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.q-jumbotron
  margin-bottom 2rem
</style>
