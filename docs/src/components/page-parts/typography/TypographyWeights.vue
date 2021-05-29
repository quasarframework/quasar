<template lang="pug">
  div
    .row.items-center.q-mb-md(
      v-for="weight in weights"
      :key="weight"
    )
      .col-sm-3.col-12
        q-badge(color="brand-primary") text-weight-{{ weight }}
      .col-sm-9.col-12.q-mb-none.q-pl-md.q-pt-sm.q-pb-sm
        div(:class="`text-weight-${weight}`") Lorem Ipsum is simply dummy text of the printing and typesetting industry.
</template>

<script>
export default {
  created () {
    this.weights = [ 'thin', 'light', 'regular', 'medium', 'bold', 'bolder' ]
  }
}
</script>
