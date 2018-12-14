<template>
  <div class="q-layout-padding">
    <h1>Focus helper test</h1>
    <q-btn class="q-ma-sm q-pa-lg" color="black" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="black" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="primary" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="primary" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="orange" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="orange" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="yellow" text-color="black" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" color="yellow" text-color="black" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" label="Test" />
    <q-btn class="q-ma-sm q-pa-lg" label="Test" />

    <q-list class="q-mt-md">
      <q-item v-for="n in 3" :key="'1.'+n" clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item - ripple</q-item-section>
      </q-item>
      <q-item class="text-primary" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item - ripple</q-item-section>
      </q-item>
      <q-item class="text-primary" v-for="n in 3" :key="'2.'+n" clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
    </q-list>

    <q-list dark class="bg-black">
      <q-item v-for="n in 5" :key="'3.'+n" clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item - ripple</q-item-section>
      </q-item>
      <q-item class="text-orange" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item - ripple</q-item-section>
      </q-item>
      <q-item class="text-orange" v-for="n in 5" :key="'4.'+n" clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
