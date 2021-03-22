<template>
  <div class="q-pa-md column q-gutter-y-lg">
    <q-card>
      <q-tabs
        v-model="tab1"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="mailsTest" label="Mails - include" />
        <q-tab name="alarms-1" label="Alarms - exclude" />
        <q-tab name="movies_2" label="Movies - none" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab1"
        animated
        keep-alive
        keep-alive-include="mailsTest"
        keep-alive-exclude="movies"
      >
        <q-tab-panel name="mailsTest">
          <my-mails />
        </q-tab-panel>

        <q-tab-panel name="alarms-1">
          <my-alarms />
        </q-tab-panel>

        <q-tab-panel name="movies_2">
          <my-movies />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-card>
      <q-tabs
        v-model="tab2"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="mails_1" label="Mails - none" />
        <q-tab name="alarms" label="Alarms - exclude" />
        <q-tab name="movies-2" label="Movies - none" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab2"
        animated
        keep-alive
        keep-alive-exclude="alarms"
      >
        <q-tab-panel name="mails_1">
          <my-mails />
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <my-alarms />
        </q-tab-panel>

        <q-tab-panel name="movies-2">
          <my-movies />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-card>
      <q-tabs
        v-model="tab3"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="mails" label="Mails - none" />
        <q-tab name="alarms_1" label="Alarms - include" />
        <q-tab name="movies" label="Movies - none" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab3"
        animated
        keep-alive
        keep-alive-include="alarms_1"
      >
        <q-tab-panel name="mails">
          <my-mails />
        </q-tab-panel>

        <q-tab-panel name="alarms_1">
          <my-alarms />
        </q-tab-panel>

        <q-tab-panel name="movies">
          <my-movies />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import MyMails from './keep-alive-components/my-mails.vue'
import MyMovies from './keep-alive-components/my-movies.vue'
import MyAlarms from './keep-alive-components/my-alarms.vue'

export default {
  components: {
    MyMovies,
    MyMails,
    MyAlarms
  },

  data () {
    return {
      tab1: 'mailsTest',
      tab2: 'mails_1',
      tab3: 'alarms_1'
    }
  }
}
</script>
