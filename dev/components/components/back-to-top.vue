<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Scroll down to see it in action.</p>

      <br>
      <q-back-to-top> <!-- :handler="refresher"> -->
        <p v-for="n in 100" class="caption">
          <span class="label bg-secondary text-white shadow-1">
            {{ n }}
          </span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

      </q-back-to-top>
    </div>
  </div>
</template>

<script>
export default {}
</script>
