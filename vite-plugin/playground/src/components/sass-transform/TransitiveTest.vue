<template>
  <h6>Transitive sass variables + breakpoint namespace</h6>

  <div class="row justify-center">
    <div class="my-transitive-div"> &nbsp; </div>
  </div>
</template>

<style lang="sass" scoped>
// $flex-gutter-sm depends on $space-base (transitive closure),
// $breakpoint-sm-min goes through map.get($sizes, ...) (needs @use sass:map)
.my-transitive-div
  padding: $flex-gutter-sm

@media (min-width: $breakpoint-sm-min)
  .my-transitive-div
    margin: $flex-gutter-xs
</style>
