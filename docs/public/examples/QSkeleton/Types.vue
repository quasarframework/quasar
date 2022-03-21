<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card flat bordered v-for="type in skeletonTypes" :key="type" style="width: 250px">
        <q-card-section>
          <div class="text-caption">"{{ type }}"</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-skeleton :type="type" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      skeletonTypes: [
        'text', 'rect', 'circle',
        'QBtn', 'QBadge', 'QChip', 'QToolbar',
        'QCheckbox', 'QRadio', 'QToggle',
        'QSlider', 'QRange', 'QInput',
        'QAvatar'
      ]
    }
  }
}
</script>
