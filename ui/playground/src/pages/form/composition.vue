<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card>
      <q-card-section>
        <div>
          Model1: "{{ model1 }}"
        </div>
        <input v-model="model1">
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div>
          Model2: "{{ model2 }}"
        </div>
        <q-input v-model="model2" dense outlined />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model1: '',
      model2: ''
    }
  }
}
</script>
