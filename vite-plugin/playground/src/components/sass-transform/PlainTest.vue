<template>
  <h6>Plain style block (no sass variables)</h6>

  <div class="row justify-center">
    <div class="my-plain-div"> &nbsp; </div>
  </div>
</template>

<style lang="scss" scoped>
// no "$" anywhere on purpose: the variables injection
// gets skipped for this style block
// (the padding is asserted by the runtime test suites — keep in sync
// with /vite-plugin/testing/fixture-values.js)
.my-plain-div {
  padding: 25px;
  background-color: rgb(1, 2, 3);
}
</style>
