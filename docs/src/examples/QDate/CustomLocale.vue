<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      <q-badge color="teal">
        Model: {{ model }}
      </q-badge>
    </div>

    <q-date v-model="model" :locale="myLocale" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '2019/02/15',

      myLocale: {
        /* starting with Sunday */
        days: 'Duminică_Luni_Marți_Miercuri_Joi_Vineri_Sâmbătă'.split('_'),
        daysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
        months: 'Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie'.split('_'),
        monthsShort: 'Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true
      }
    }
  }
}
</script>
