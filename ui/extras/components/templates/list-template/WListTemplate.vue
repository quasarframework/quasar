<template lang="pug">
  w-page(:title="title" padding offset)
    template(v-slot:title-right)
      slot(name="title-right")
    w-card.q-mt-md
      w-card-section.filters
        .row
          slot(name="filters")
      w-separator
      w-card-section
        slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
