<template>
  <div>
    <div class="layout-padding">
      <div class="bg-secondary text-white">
        Model: <em>{{ model }}</em>
      </div>
      <q-datetime
        class="q-my-md"
        v-model="model"
        type="datetime"
        clearable
        format24h
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
      <q-datetime
        class="q-my-md"
        v-model="model"
        type="datetime"
        clearable
        format24h
        minimal
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
      <div class="q-my-md row gutter-md justify-center">
        <div>
          <q-datetime
            v-model="model"
            type="datetime"
            clearable
            @change="value => log('@change', value)"
            @input="value => log('@input', value)"
            @focus="log('@focus')"
            @blur="log('@blur')"
          />
        </div>
        <div>
          <q-datetime
            v-model="model"
            type="datetime"
            clearable
            minimal
            @change="value => log('@change', value)"
            @input="value => log('@input', value)"
            @focus="log('@focus')"
            @blur="log('@blur')"
          />
        </div>
      </div>
      <q-datetime
        v-model="model"
        type="datetime"
        clearable
        modal
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
      <q-datetime
        v-model="model"
        type="datetime"
        clearable
        modal
        minimal
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
      <div class="q-my-md row gutter-md justify-center">
        <div>
          <q-datetime-picker
            v-model="model"
            type="datetime"
            format24h
            default-view="month"
            @change="value => log('@change', value)"
            @input="value => log('@input', value)"
            @focus="log('@focus')"
            @blur="log('@blur')"
          />
        </div>
        <div>
          <q-datetime-picker
            v-model="model"
            type="datetime"
            format24h
            minimal
            default-view="year"
            @change="value => log('@change', value)"
            @input="value => log('@input', value)"
            @focus="log('@focus')"
            @blur="log('@blur')"
          />
        </div>
      </div>
      <q-datetime-picker
        class="q-my-md"
        v-model="model"
        type="datetime"
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
      <q-datetime-picker
        class="q-my-md"
        v-model="model"
        type="datetime"
        minimal
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />

      <div>{{ min }} - {{ max }}</div>
      <div class="bg-secondary text-white">
        Model: <em>{{ minMaxModel }}</em>
      </div>
      <q-datetime-picker
        class="q-my-md"
        v-model="model"
        type="datetime"
        format24h
        :min="min"
        :max="max"
        @change="value => log('@change', value)"
        @input="value => log('@input', value)"
        @focus="log('@focus')"
        @blur="log('@blur')"
      />
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

const day = '2016-10-24T10:40:14.674Z'

export default {
  data () {
    return {
      model: undefined,
      minMaxModel: date.formatDate(day),
      min: date.subtractFromDate(day, {days: 45}),
      max: date.addToDate(day, {days: 8, month: 4, minutes: 10})
    }
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    }
  }
}
</script>
