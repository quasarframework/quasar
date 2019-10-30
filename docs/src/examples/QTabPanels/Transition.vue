<template>
  <div class="q-pa-md">
    <div style="max-width: 600px">
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-lg"
      >
        <q-tab class="text-purple" name="mails" label="Mails" />
        <q-tab class="text-orange" name="alarms" label="Alarms" />
        <q-tab class="text-teal" name="movies" label="Movies" />
      </q-tabs>

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="bg-purple text-white text-center"
        >
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Ad molestiae non facere animi nobis, similique nemo velit reiciendis corporis impedit nam in.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Nostrum necessitatibus expedita dolores? Voluptatem repudiandae magni ea.
          </q-tab-panel>
        </q-tab-panels>

        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="fade"
          transition-next="fade"
          class="bg-orange text-white text-center"
        >
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Ad molestiae non facere animi nobis, similique nemo velit reiciendis corporis impedit nam in.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Nostrum necessitatibus expedita dolores? Voluptatem repudiandae magni ea.
          </q-tab-panel>
        </q-tab-panels>

        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="slide-left-then-fade"
          transition-next="slide-right-then-fade"
          :transition-duration="{ enter: 2000, leave: 1000 }"
          class="bg-teal text-white text-center"
        >
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            <span class="nested-fade">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            <span class="nested-fade">Ad molestiae non facere animi nobis, similique nemo velit reiciendis corporis impedit nam in.</span>
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            <span class="nested-fade">Nostrum necessitatibus expedita dolores? Voluptatem repudiandae magni ea.</span>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'mails'
    }
  }
}
</script>

<style lang="stylus">
/* A nested transition to demonstrate the transition-duration property */
.q-transition

  &--slide-left-then-fade
  &--slide-right-then-fade

    &-leave-active
      position absolute

    &-enter-active
      transition transform 1s ease-in-out

      & .nested-fade
        transition opacity 1s ease-in 1s

    &-leave-active
      transition transform 1s ease-in-out

      & .nested-fade
        transition opacity 1s ease-out

    &-enter .nested-fade
    &-leave .nested-fade
    &-leave-to .nested-fade
      opacity 0

  &--slide-right-then-fade
    &-enter
      transform translate3d(-100%, 0, 0)
    &-leave-to
      transform translate3d(100%, 0, 0)

  &--slide-left-then-fade
    &-enter
      transform translate3d(100%, 0, 0)
    &-leave-to
      transform translate3d(-100%, 0, 0)

</style>
