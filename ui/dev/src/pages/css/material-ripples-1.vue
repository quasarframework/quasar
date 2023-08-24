<template>
  <div class="docs-ripple row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on the area below to see it in action.
      </p>

      <div
        v-ripple
        tabindex="0"
        class="relative-position ripple-example bg-white text-black"
        style="height: 150px;"
      />

      <div
        v-ripple
        tabindex="0"
        class="relative-position ripple-example bg-primary"
        style="height: 150px"
      />

      <div
        v-ripple
        tabindex="0"
        class="relative-position ripple-example bg-white text-black"
        style="height: 50px"
      />

      <div
        v-ripple
        tabindex="0"
        class="relative-position ripple-example bg-cyan"
        style="height: 50px"
      />

      <div
        v-ripple:primary
        tabindex="0"
        class="relative-position ripple-example bg-white text-black"
        style="height: 50px"
      >
        Primary colored ripple
      </div>

      <div
        v-ripple="{ color: 'yellow' }"
        tabindex="0"
        class="relative-position ripple-example bg-cyan"
        style="height: 50px"
      >
        Yellow colored ripple
      </div>

      <div class="row items-center justify-around q-mt-md">
        <div
          tabindex="0"
          v-ripple.center
          class="relative-position ripple-example bg-white text-black ripple-round"
        >
          Center
        </div>

        <div
          tabindex="0"
          v-ripple
          class="relative-position ripple-example bg-white text-black ripple-round"
        >
          Touch point
        </div>

        <div
          tabindex="0"
          v-ripple.center
          class="q-ml-sm relative-position ripple-example bg-cyan ripple-round"
        >
          Center
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="sass">
.ripple-example
  border-radius: 3px
  cursor: pointer
  color: white
  display: flex
  align-items: center
  justify-content: center
  user-select: none

  &:focus
    outline: 1px solid $grey
    outline-offset: 3px

  & + &
    margin-top: 24px

.ripple-round
  width: 150px
  height: 150px
  border-radius: 50%
  margin-top: 0 !important
</style>
