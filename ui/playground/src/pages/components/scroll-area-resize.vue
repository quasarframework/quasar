<template>
  <div>
    <div style="width: 400px; height: 100vh;" class="scroll">
      <q-scroll-area
        ref="scroll"
        class="bg-yellow fit"
      >
        <div>
          <div style="margin-top: 150px" />
          <div style="margin-bottom: 25px" v-for="n in 4" :key="n">
            {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <q-btn label="Click" color="primary" />
          </div>
        </div>
      </q-scroll-area>
    </div>

    <div style="height: 300px" />
  </div>
</template>
