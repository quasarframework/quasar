<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card flat bordered v-for="animation in skeletonAnimations" :key="animation" style="width: 250px">
        <q-card-section>
          <div class="text-caption">"{{ animation }}"</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-skeleton :animation="animation" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      skeletonAnimations: [
        'wave', 'pulse', 'pulse-x', 'pulse-y', 'fade', 'blink', 'none'
      ]
    }
  }
}
</script>
