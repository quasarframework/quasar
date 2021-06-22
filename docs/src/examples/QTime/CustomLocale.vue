<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      <q-badge color="teal">
        Model: {{ model }}
      </q-badge>
    </div>

    <q-time v-model="model" mask="MMMM D, YYYY - HH:mm" :locale="myLocale" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref('Febrero 22, 2019 - 21:02'),

      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_')
      }
    }
  }
}
</script>
