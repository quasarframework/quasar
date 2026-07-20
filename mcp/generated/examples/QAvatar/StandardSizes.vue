<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      color="primary"
      text-color="white"
      icon="directions"
    />
  </div>
</template>
