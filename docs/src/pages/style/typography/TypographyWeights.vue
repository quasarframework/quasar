<template>
  <div>
    <div
      v-for="weight in weights"
      :key="weight"
      class="row items-center q-mb-md"
    >
      <div class="col-sm-3 col-12">
        <q-badge color="brand-primary" outline :label="`text-weight-${ weight }`" />
      </div>
      <div class="col-sm-9 col-12 q-mb-none q-pl-md q-pt-sm q-pb-sm">
        <div :class="`text-weight-${weight}`">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const weights = [ 'thin', 'light', 'regular', 'medium', 'bold', 'bolder' ]
</script>
