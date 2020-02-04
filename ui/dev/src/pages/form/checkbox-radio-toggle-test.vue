<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <q-toggle v-model="keepColor" label="Keep color" :dark="dark" />
    <q-toggle v-model="disable" label="Disable" :dark="dark" />
    <q-toggle v-model="dark" label="Dark" :dark="dark" :false-value="null" />

    <q-card tag="form" @submit.prevent="onSubmit" :dark="dark" :disabled="disable">
      <q-card-section>
        <div class="q-mb-lg row q-col-gutter-x-md">
          <q-select name="select1" filled class="col" v-model="select1" dense :options="options" :dark="dark" :disable="disable" label="select1 - Single" clearable />
          <q-select name="select2" filled class="col" v-model="select2" dense :options="options" :dark="dark" :disable="disable" label="select2 - Multiple" multiple clearable />
        </div>

        <div class="q-mb-lg row q-col-gutter-x-md">
          <q-input name="text1" filled class="col" v-model="text1" dense :dark="dark" :disable="disable" clearable label="text1 - Text" />
          <q-input name="textarea1" filled class="col" v-model="text2" dense :dark="dark" :disable="disable" clearable type="textarea" autogrow label="textarea1 - Textarea" />
          <q-file name="file1" filled class="col" v-model="file" dense :dark="dark" :disable="disable" clearable label="file1 - File" />
        </div>

        <div class="q-my-lg">
          <q-radio name="radio1" v-model="option" val="opt1" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Option 1`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" val="opt2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Option 2`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" val="opt3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Option 3`" :keep-color="keepColor" />
          <q-radio name="radio1" v-model="option" :val="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Option Obj`" :keep-color="keepColor" />
        </div>

        <div class="q-my-lg">
          <q-checkbox name="checkbox1" v-model="checked" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Checkbox`" :keep-color="keepColor" />
          <q-checkbox name="checkbox2" v-model="checked2" :true-value="2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Checkbox`" :keep-color="keepColor" />
          <q-checkbox name="checkbox3" v-model="checked3" :true-value="3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Checkbox`" :keep-color="keepColor" />
          <q-checkbox name="checkbox4" v-model="checked4" :true-value="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Checkbox Obj`" :keep-color="keepColor" />
        </div>

        <div class="q-my-lg">
          <q-toggle name="toggle1" v-model="checked" :disable="disable" :dark="dark" color="primary" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle2" v-model="checked2" :true-value="2" :disable="disable" :dark="dark" color="accent" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle3" v-model="checked3" :true-value="3" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Toggle Label`" :keep-color="keepColor" />
          <q-toggle name="toggle4" v-model="checked4" :true-value="trueValue" :disable="disable" :dark="dark" color="teal" :label="`${disable ? 'Disabled ' : ''}Toggle Label Obj`" :keep-color="keepColor" />
        </div>
      </q-card-section>

      <q-card-actions>
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

    <div class="row items-center q-my-md">
      <span class="text-h6 q-mr-md">Sizes</span>
      <div>
        ( <q-toggle v-model="dense" label="Dense" :dark="dark" /> )
      </div>
    </div>
    <q-markup-table :dark="dark">
      <tbody>
        <tr v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
          <td>
            <q-radio
              :size="size"
              :label="size"
              v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
          <td>
            <q-checkbox
              :size="size"
              :label="size"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
          <td>
            <q-toggle
              :size="size"
              :label="size"
              unchecked-icon="visibility_off" checked-icon="visibility"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table class="q-mt-lg" separator="cell" :dark="dark">
      <tbody>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-radio
              :size="size"
              :label="size"
              v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-checkbox
              :size="size"
              :label="size"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-toggle
              :size="size"
              :label="size"
              unchecked-icon="visibility_off" checked-icon="visibility"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keepColor: true,
      disable: true,
      dark: null,
      dense: false,

      checked: true,
      checked2: false,
      checked3: false,
      checked4: false,

      trueValue: {
        value: true
      },

      option: 'opt1',

      select1: null,
      select2: null,
      options: [ 'Option 1', 'Option 2', { label: 'Option 3 - Obj' }, { label: 'Option 4 - Obj' } ],

      text1: '1',
      text2: '2',

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
          value
        })
      }
      this.submitResult = submitResult
    }
  }
}
</script>
