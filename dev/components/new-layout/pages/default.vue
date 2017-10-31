<template>
  <q-page padding class="bg-yellow">
    <div v-for="n in 50">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>

    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
    </q-page-sticky>
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
}
</script>
