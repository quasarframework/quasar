<template>
  <div class="q-layout-padding">
    <h5>QAvatar</h5>
    <div class="row q-gutter-sm items-center">
      <q-avatar
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'avatar'"
        :size="size"
        color="primary"
        text-color="white"
        icon="directions"
      />
    </div>

    <h5>QIcon</h5>
    <div class="row q-gutter-sm items-center">
      <q-icon
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'icon'"
        :size="size"
        color="primary"
        name="directions"
      />
    </div>

    <h5>QCircularProgress</h5>
    <div class="row q-gutter-sm items-center">
      <q-circular-progress
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'icon'"
        :size="size"
        :value="78"
        color="primary"
      />
    </div>

    <h5>QLinearProgress</h5>
    <div class="row q-gutter-sm items-center">
      <q-linear-progress
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'icon'"
        :size="size"
        :value="78"
        color="primary"
      />
    </div>

    <h5>QRating</h5>
    <div class="column q-gutter-sm">
      <q-rating
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'icon'"
        :size="size"
        :model-value="3"
        color="primary"
        icon="directions"
      />
    </div>

    <h5>QSpinner</h5>
    <div class="column q-gutter-sm">
      <q-spinner
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size + 'icon'"
        :size="size"
        color="primary"
      />
    </div>
  </div>
</template>
