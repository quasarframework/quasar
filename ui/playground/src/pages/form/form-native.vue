<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <q-toggle v-model="keepColor" label="Keep color" :dark="dark" />
    <q-toggle v-model="disable" label="Disable" :dark="dark" />
    <q-toggle v-model="dark" label="Dark" :dark="dark" :false-value="null" />

    <q-card tag="form" @submit.prevent="onSubmit" :dark="dark">
      <q-card-section>
        <div class="q-mb-lg row q-col-gutter-x-md">
          <q-select name="select1" filled class="col" v-model="select1" :options="options1" :dark="dark" :disable="disable" label="select1 - Single" clearable />
          <q-select name="select2" filled class="col" v-model="select2" :options="options1" :dark="dark" :disable="disable" label="select2 - Multiple" multiple clearable />
        </div>

        <div class="q-mb-lg row q-col-gutter-x-md">
          <q-select name="select3" filled class="col" v-model="select3" :options="options2" :dark="dark" :disable="disable" label="select3 - obj - Single" clearable />
          <q-select name="select4" filled class="col" v-model="select4" :options="options2" :dark="dark" :disable="disable" label="select4 - obj - Multiple" multiple clearable />
        </div>

        <div class="q-mb-lg row q-col-gutter-x-md">
          <q-input name="text1" filled class="col" v-model="text1" :dark="dark" :disable="disable" clearable label="text1 - Text" />
          <q-input name="textarea1" filled class="col" v-model="text2" :dark="dark" :disable="disable" clearable type="textarea" autogrow label="textarea1 - Textarea" />
          <q-file name="file1" filled class="col" v-model="file" :dark="dark" :disable="disable" clearable label="file1 - File" />
        </div>

        <div class="q-my-lg">
          <q-radio name="radio1" v-model="option" val="opt1" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Option 1`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" val="opt2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Option 2`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" val="opt3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Option 3`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" :val="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Option Obj`" :keep-color="keepColor" />
        </div>

        <div class="q-my-lg">
          <q-checkbox name="checkbox1" v-model="checked" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Checkbox 1`" :keep-color="keepColor" />
          <q-checkbox name="checkbox2" v-model="checked2" :true-value="2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Checkbox 2`" :keep-color="keepColor" />
          <q-checkbox name="checkbox3" v-model="checked3" :true-value="3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Checkbox 3`" :keep-color="keepColor" />
          <q-checkbox name="checkbox4" v-model="checked4" :true-value="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Checkbox Obj 4`" :keep-color="keepColor" />
        </div>

        <div class="q-my-lg">
          <q-toggle name="toggle1" v-model="checked" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle2" v-model="checked2" :true-value="2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle3" v-model="checked3" :true-value="3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle4" v-model="checked4" :true-value="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Toggle Label Obj`" :keep-color="keepColor" />
        </div>

        <div class="q-my-lg">
          <q-knob name="knob1" size="100px" color="orange" v-model="number1" :disable="disable" :dark="dark" />
          <q-knob name="knob2" size="100px" color="blue" v-model="number2" show-value :disable="disable" :dark="dark" />
          <q-knob name="knob3" size="100px" color="green" v-model="number3" show-value :disable="disable" :dark="dark">
            <div class="text-center">Slot<br/>{{ number3 }}</div>
          </q-knob>
        </div>

        <div class="q-my-lg">
          <q-slider name="slider1" v-model="number4" :disable="disable" :dark="dark" />
        </div>

        <div class="q-my-lg">
          <q-range name="range1" v-model="range1" :disable="disable" :dark="dark" />
        </div>

        <div class="q-my-lg">
          <q-rating name="rating1" size="48px" v-model="rating1" :disable="disable" :dark="dark" />
        </div>

        <div class="q-my-lg q-gutter-md">
          <q-date name="date" v-model="date" :disable="disable" :dark="dark" />
          <q-time name="time" v-model="time" :disable="disable" :dark="dark" />
          <q-color name="color" v-model="color" :disable="disable" :dark="dark" />
          <q-btn-toggle
            name="btn-toggle"
            v-model="btnToggle"
            toggle-color="primary"
            color="white"
            text-color="black"
            no-caps
            :options="btnToggleOptions"
            :disable="disable"
            :dark="dark"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="bg-grey-1">
        <q-btn color="primary" type="submit" label="Submit" class="q-px-md" />
        <div class="col row q-gutter-sm items-center q-pl-sm">
          <div
            v-for="(item, index) in submitResult"
            :key="index"
            class="col-grow q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
          >
            {{ item.name }} = {{ item.value }}
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keepColor: true,
      disable: false,
      dark: null,

      checked: true,
      checked2: false,
      checked3: false,
      checked4: false,

      trueValue: {
        value: true
      },

      date: null,
      time: null,
      color: 'rgb(2,2,2)',
      btnToggle: null,
      btnToggleOptions: [
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ],

      option: 'opt1',

      select1: null,
      select2: null,
      select3: null,
      select4: null,
      options1: [ 'Option 1', 'Option 2', { label: 'Option 3 - Obj' }, { label: 'Option 4 - Obj' } ],
      options2: [
        { label: 'Option 1 - Obj', value: 'Option 1' },
        { label: 'Option 2 - Obj', value: 'Option 2' },
        { label: 'Option 3 - Obj', value: 'Option 3' },
        { label: 'Option 4 - Obj', value: 'Option 4' }
      ],

      text1: '1',
      text2: '2',

      number1: 10,
      number2: 20,
      number3: 30,
      number4: 40,

      range1: {
        min: 20,
        max: 60
      },

      rating1: 3,

      file: null,

      submitResult: null
    }
  },
  methods: {
    onSubmit (evt) {
      const formData = new FormData(evt.target)
      const submitResult = []
      for (const [ name, value ] of formData.entries()) {
        submitResult.push({
          name,
          value: value.name || value
        })
      }
      this.submitResult = submitResult
    }
  }
}
</script>
