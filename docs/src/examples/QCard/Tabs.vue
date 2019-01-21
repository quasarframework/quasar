<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card square>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/img/guy-avatar.png" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="shake">Our Changing Planet - 2019 Edition</q-item-label>
          <q-item-label caption>by Kurt Wagner</q-item-label>
        </q-item-section>
      </q-item>

      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="About" name="one" />
        <q-tab label="Leave a Comment" name="two" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          Our planet is in perpetual flux, yet Kurt Wagner
          introduces this complex subject in a way that is
          accessible for all ages and interests. This, the
          2019 Edition of the 1983 Classic, is full of
          updated maps and contemporary data resources.
          <q-separator />
          <q-card-actions class="float-right">
            <q-btn color="teal" flat>Buy E-Book for $4.99 </q-btn>
          </q-card-actions>
        </q-tab-panel>

        <q-tab-panel name="two">
          <q-editor v-model="comments"></q-editor>
          <q-card-actions class="float-right">
            <q-btn color="teal" flat>Submit</q-btn>
          </q-card-actions>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tab: 'one',
      stars: 3,
      comments: ''
    }
  }
}
</script>
