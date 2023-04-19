<template>
  <div class="q-pa-md">
    <q-layout view="lhh LpR lff" container style="height: 300px" class="shadow-2 rounded-borders">
      <q-header class="bg-black">
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
            <q-btn fab icon="add" color="accent" />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
