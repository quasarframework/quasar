<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">
      <q-spinner-cube
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size"
        :size="size"
        color="primary"
      />
    </div>
  </div>
</template>
