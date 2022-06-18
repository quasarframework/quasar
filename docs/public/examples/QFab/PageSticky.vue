<template>
  <div class="q-pa-md">
    <q-layout view="lhh LpR lff" container style="height: 300px" class="shadow-2 rounded-borders">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-fab
              icon="add"
              direction="up"
              color="accent"
            >
              <q-fab-action @click="onClick" color="primary" icon="person_add" />
              <q-fab-action @click="onClick" color="primary" icon="mail" />
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
