<template>
  <div>
    <div
      v-for="heading in headings"
      :key="heading.label"
      class="row items-center q-mb-lg"
    >
      <div class="col-sm-3 col-12">
        <q-badge color="brand-primary" outline :label="heading.cls" />
        <q-badge
          v-if="heading.equivalent"
          class="q-ml-sm"
          color="secondary"
          outline
          :label="heading.equivalent"
        />
      </div>
      <div class="col-sm-9 col-12" :class="heading.cls">
        {{ heading.sample || heading.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { headings } from './typography-classes.js'
</script>
