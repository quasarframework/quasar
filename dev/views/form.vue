<template>
  <div class="caret-down"></div>
  <div class="caret-up"></div>
  <div class="caret-left"></div>
  <div class="caret-right"></div>
  <p class="caption">Date</p>
  {{ timestamp }}
  <quasar-datetime :model.sync="timestamp" type="date"></quasar-datetime>
  <quasar-datetime :model.sync="timestamp" type="date" disabled></quasar-datetime>
  <br>
  <quasar-inline-datetime :model.sync="timestamp" type="date"></quasar-inline-datetime>
  <quasar-inline-datetime :model.sync="timestamp" type="date" disabled></quasar-inline-datetime>
  <p class="caption">Time</p>
  <quasar-datetime :model.sync="timestamp" type="time"></quasar-datetime>
  <br>
  <quasar-inline-datetime :model.sync="timestamp" type="time"></quasar-inline-datetime>
  <p class="caption">Datetime</p>
  <quasar-datetime :model.sync="timestamp" type="datetime"></quasar-datetime>
  <br>
  <quasar-inline-datetime :model.sync="timestamp" type="datetime"></quasar-inline-datetime>

  <div style="height: 50px">&nbsp;</div>
  <div style="border: 1px solid black">
    <input v-model="text">
    <input v-model="text" :disabled="true">
  </div>
  <br><br>
  <div class="stacked-label" style="border: 1px solid black">
    <input v-model="text">
    <label>Username</label>
  </div>
  <br><br>
  <div class="floating-label" style="border: 1px solid black">
    <input v-model="text" required>
    <label>Username</label>
  </div>
  <br><br>

  <p class="caption">Knob</p>
  <quasar-knob :model.sync="knob" size="250px" :min="-20" :line-width="2" track-color="white" :max="50" :step="0.5" :label="knob + ' points'"></quasar-knob>
  <quasar-knob :model.sync="knob" style="font-size: 3rem" :min="-20" :max="50" :step="5"></quasar-knob>
  <quasar-knob :model.sync="knob" :min="-20" :max="50" disabled></quasar-knob>
  <br>
  <button @click="knob = 70">Knob to 70</button>

  <p class="caption">Text Fields</p>
  <div class="list">
    <div class="item two-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <input v-model="text" class="full-width">
      </div>
    </div>

    <hr>
    <div class="item two-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <input v-model="text" placeholder="Placeholder" class="full-width">
      </div>
    </div>

    <hr>
    <div class="item two-lines">
      <i class="item-primary">edit</i>
      <div class="item-content row items-center">
        <div style="margin-right: 10px;">Label:</div>
        <input class="auto" v-model="text">
      </div>
    </div>

    <hr>
    <div class="item three-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <div class="stacked-label">
          <input v-model="text" class="full-width">
          <label>Username</label>
        </div>
      </div>
    </div>

    <hr>
    <div class="item three-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <div class="floating-label">
          <input v-model="text" required class="full-width">
          <label>Username</label>
        </div>
      </div>
    </div>

    <hr>
    <div class="item multiple-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <textarea v-model="multiline" class="full-width"></textarea>
      </div>
    </div>

    <hr>
    <div class="item multiple-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <div class="stacked-label">
          <textarea v-model="multiline" class="full-width"></textarea>
          <label>Username</label>
        </div>
      </div>
    </div>

    <hr>
    <div class="item multiple-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <div class="floating-label">
          <textarea v-model="multiline" required class="full-width"></textarea>
          <label>Username</label>
        </div>
      </div>
    </div>

    <hr>
    <div class="item multiple-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        <quasar-chips :model.sync="chips"></quasar-chips>
      </div>
    </div>
  </div>

  <div class="layout-padding">
    <textarea v-model="multiline"></textarea>
    <br><br>
    <div class="stacked-label">
      <textarea v-model="multiline"></textarea>
      <label>Username</label>
    </div>
    <br><br>
    <div class="floating-label">
      <textarea v-model="multiline" required></textarea>
      <label>Username</label>
    </div>
  </div>






  <h2>Select</h2>
  <h4>Dialog Select</h4>
  Text
  <quasar-dialog-select :disabled="true" style="width: 200px;" type="radio" :model.sync="select" :options="selectOptions" ok-label="Pick"></quasar-dialog-select>
  <quasar-dialog-select style="width: 300px;" type="checkbox" :model.sync="select" :options="selectOptions" ok-label="Pick"></quasar-dialog-select>
  <br><br>
  <div class="list">
    <div class="list-label">Single Selection</div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Radio:</div>
        <quasar-dialog-select class="auto" type="radio" :model.sync="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
      </div>
    </div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Radio:</div>
        <quasar-dialog-select class="auto" type="radio" :model.sync="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
      </div>
    </div>
    <hr>
    <div class="list-label">Multiple Selection</div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Checkbox:</div>
        <quasar-dialog-select class="auto" type="checkbox" :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
      </div>
    </div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Toggle:</div>
        <quasar-dialog-select class="auto" type="toggle" :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
      </div>
    </div>
  </div>

  <h4>Simple Select</h4>
  Text
  <quasar-select type="radio" style="width: 200px;" :disabled="true" :model.sync="select" :options="selectOptions" v-ref:sel></quasar-select>
  <quasar-select type="radio" style="width: 300px;" :model.sync="select" :options="selectOptions" v-ref:sel></quasar-select>
  <br><br>
  <div class="list">
    <div class="list-label">Single Selection</div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Radio:</div>
        <quasar-select class="auto" type="radio" :model.sync="select" :options="selectOptions" v-ref:sel></quasar-select>
      </div>
    </div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Radio:</div>
        <quasar-select class="auto" type="radio" :model.sync="select" :options="selectOptions"></quasar-select>
      </div>
    </div>
    <div class="list-label">Multiple Selection</div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Checkbox:</div>
        <quasar-select class="auto" type="checkbox" :model.sync="multipleSelect" :options="selectOptions" classes="secondary"></quasar-select>
      </div>
    </div>
    <div class="item multiple-lines">
      <i class="item-primary">supervisor_account</i>
      <div class="item-content row items-baseline">
        <div style="margin-right: 10px;">Toggle:</div>
        <quasar-select class="auto" type="toggle" :model.sync="multipleSelect" :options="selectOptions"></quasar-select>
      </div>
    </div>
  </div>

  <h2>Text Input</h2>
  Inline with text <input v-model="username" class="inline">
  <input v-model="password" type="password">

  <h2>Text Chips Input</h2>
  <quasar-chips :model.sync="chips"></quasar-chips>
  <quasar-chips :model.sync="chips" :disabled="true"></quasar-chips>
  <br><br>

  <h2>Numeric</h2>
  Inline with text <quasar-numeric :model.sync="number" :min="2" :max="1000"></quasar-numeric>
  <br>
  <quasar-numeric :model.sync="number" style="width: 500px;"></quasar-numeric>
  <quasar-numeric disabled :model.sync="number"></quasar-numeric>
  <br><br><quasar-numeric :model.sync="number2" :min="2" :max="100" :debounce="1000" :step="0.5">Number label</quasar-numeric>
  <br><br>
  <div class="list">
    <div class="item multiple-lines">
      <i class="item-primary">edit</i>
      <div class="item-content">
        Number: <quasar-numeric :model.sync="number"></quasar-numeric>
      </div>
    </div>
  </div>

  <h2>Textarea</h2>
  {{textarea}}
  <textarea v-model="multiline" placeholder="Textarea label"></textarea>


  <h2>Checkbox</h2>
  <quasar-checkbox :model.sync="check" style="border: 1px solid black"></quasar-checkbox>
  <quasar-checkbox :model.sync="check" class="secondary" :disabled="true"></quasar-checkbox>
  <quasar-checkbox :model.sync="check" class="orange"></quasar-checkbox>
  <label>
    <quasar-checkbox :model.sync="check"></quasar-checkbox>
    Checkbox Label
  </label>
  <p>
    <quasar-checkbox :model.sync="check"></quasar-checkbox>
    <quasar-checkbox :model.sync="check"></quasar-checkbox>
    <quasar-checkbox :model.sync="check"></quasar-checkbox>
  </p>

  <h2>Radio</h2>
  <quasar-radio :model.sync="radio" value="opt1" style="border: 1px solid black"></quasar-radio>
  <quasar-radio :model.sync="radio" value="opt2" class="secondary" :disabled="true"></quasar-radio>
  <quasar-radio :model.sync="radio" value="opt2" class="orange"></quasar-radio>
  <label>
    <quasar-radio :model.sync="radio" value="opt2"></quasar-radio>
    Radio Label
  </label>
  <p>
    <quasar-radio :model.sync="radio" value="opt1">Option 1</quasar-radio>
    <quasar-radio :model.sync="radio" value="opt2">Option 2</quasar-radio>
    <quasar-radio :model.sync="radio" value="opt3">Option 3</quasar-radio>
  </p>

  <h2>Toggle</h2>
  <quasar-toggle :model.sync="check" style="border: 1px solid black"></quasar-toggle>
  <quasar-toggle :model.sync="check" class="secondary" :disabled="true"></quasar-toggle>
  <quasar-toggle :model.sync="check" class="orange" icon="alarm"></quasar-toggle>
  <label>
    <quasar-toggle :model.sync="check"></quasar-toggle>
    Toggle label
  </label>
  <label>
    <quasar-toggle :model.sync="check" icon="mail"></quasar-toggle>
    With Icon
  </label>
  <p>
    <quasar-toggle :model.sync="check"></quasar-toggle> Inline with Text
  </p>

  <h2>Range</h2>
  {{ range.modelMin }} - {{ range.modelMax }}
  <!--
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="1" label></quasar-double-range>
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="9" label></quasar-double-range>
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="9" label snap></quasar-double-range>
-->
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="10" label snap markers></quasar-double-range>
<!--
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="1" label></quasar-double-range>
  <quasar-double-range :model-min.sync="range.modelMin" :model-max.sync="range.modelMax" :step="1" label></quasar-double-range>
-->

  [1, 5, 1] - {{range.model}}
  <br>
  <quasar-range :model.sync="range.model" :step="1" style="border: 1px solid black"></quasar-range>
  <quasar-range :model.sync="range.model" :step="1" :disabled="true"></quasar-range>
  <quasar-range :model.sync="range.model" snap="true" markers></quasar-range>
  <quasar-range :model.sync="range.model" :step="1" snap="true"></quasar-range>

  <br><br>
  [2, 5, 1] - {{range.model}}
  <br>
  <quasar-range :model.sync="range.model" :min="2" :step="1" style="border: 1px solid black"></quasar-range>
  <quasar-range :model.sync="range.model" :min="2" :step="1"></quasar-range>
  <quasar-range :model.sync="range.model" :min="2" snap="true"></quasar-range>
  <quasar-range :model.sync="range.model" :min="2" :step="1" snap="true"></quasar-range>

  <br><br>
  [20, 50, 5] - {{range.model2}}
  <br>
  <quasar-range :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap markers></quasar-range>
  <quasar-range :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" style="border: 1px solid black"></quasar-range>
  <quasar-range :model.sync="range.model2" :min="20" :max="50" :step="5" label="true"></quasar-range>
  <quasar-range :model.sync="range.model2" :min="20" :max="50" :step="5" snap="true" label="true"></quasar-range>
  <quasar-range :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap></quasar-range>


  <quasar-range class="secondary" :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap="true"></quasar-range>
  <quasar-range class="orange" :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap="true"></quasar-range>
  <quasar-range class="dark" :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap="true"></quasar-range>
  <quasar-range class="yellow" :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap="true"></quasar-range>
  <quasar-range class="light" :model.sync="range.model2" :min="20" :max="50" :step="5" label="true" snap="true"></quasar-range>

  <br><br>
  [-50, 50, 5] - {{range.model3}}
  <br>
  <quasar-range :model.sync="range.model3" :min="-50" :max="50" :step="5" style="border: 1px solid black"></quasar-range>
  <quasar-range :model.sync="range.model3" :min="-50" :max="50" :step="5"></quasar-range>
  <quasar-range :model.sync="range.model3" :min="-50" :max="50" snap="true"></quasar-range>
  <quasar-range :model.sync="range.model3" :min="-50" :max="50" :step="5" snap="true"></quasar-range>
</template>

<script>
export default {
  data () {
    return {
      chips: ['Joe', 'Jim'],
      check: false,
      radio: 'opt2',
      range: {
        model: 4,
        model2: 25,
        model3: -10,
        min: 1,
        max: 100,
        modelMin: 10,
        modelMax: 40
      },
      select: 'fb',
      multipleSelect: ['goog', 'twtr'],
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ],
      username: '',
      password: '',
      text: '',
      multiline: '',
      number: 64,
      number2: 44,
      timestamp: '2004-02-01T20:45:00.000Z',
      knob: 25
    }
  }
}
</script>
