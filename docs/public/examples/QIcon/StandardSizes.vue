<template>
  <div class="q-pa-md">
    <div class="text-purple q-gutter-md">
      <q-icon
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size"
        :size="size"
        name="font_download"
      />
    </div>
  </div>
</template>
