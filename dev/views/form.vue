<template>
  <h2>Text Input</h2>
  Inline with text <input v-model="username" class="inline">
  <input v-model="password" type="password">

  <br><br>

  <div class="list inner-delimiter bordered">
    <div class="list-header">Fixed</div>
    <div class="item fixed-label">
      <div class="item-content">
        <label for="user1" class="item-label">Username</label>
        <input id="user1" v-model="username">
      </div>
    </div>
    <div class="item fixed-label">
      <div class="item-content">
        <label for="pass1" class="item-label">Password</label>
        <input id="pass1" v-model="password" type="password">
      </div>
    </div>
  </div>

  <div class="list inner-delimiter bordered">
    <div class="list-header">Floating</div>
    <div class="item floating-label">
      <div class="item-content">
        <input v-model="username" required>
        <label>Username</label>
      </div>
    </div>
    <div class="item floating-label">
      <div class="item-content">
        <input v-model="password" type="password" required>
        <label>Password</label>
      </div>
    </div>
  </div>

  <div class="list inner-delimiter bordered">
    <div class="list-header">Inline</div>
    <div class="item inline-label">
      <label class="item-content">
        Username
        <input v-model="username">
      </label>
    </div>
    <div class="item inline-label">
      <label class="item-content">
        Password
        <input v-model="password" type="password">
      </label>
    </div>
  </div>

  <div class="list inset inner-delimiter bordered">
    <div class="list-header">Inset and Fixed</div>
    <div class="item">
      <div class="item-content fixed-label">
        <label for="user2" class="item-label">Username</label>
        <input id="user2" v-model="username">
      </div>
    </div>
    <div class="item fixed-label">
      <div class="item-content">
        <label for="pass2" class="item-label">Password</label>
        <input id="pass2" v-model="password" type="password">
      </div>
    </div>
  </div>

  <div class="list inner-delimiter bordered">
    <div class="list-header">Placeholder</div>
    <div class="item">
      <div class="item-content">
        <input v-model="username" placeholder="Username">
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <input v-model="password" type="password" placeholder="Password">
      </div>
    </div>
  </div>

  <div class="list inner-delimiter bordered">
    <div class="list-header">Stacked</div>
    <div class="item stacked-label">
      <div class="item-content">
        <input id="user4" v-model="username" required>
        <label for="user4">Username</label>
      </div>
    </div>
    <div class="item stacked-label">
      <div class="item-content">
        <input id="pass4" v-model="password" type="password" required>
        <label for="pass4">Password</label>
      </div>
    </div>
  </div>


  <h2>Numeric</h2>
  Inline with text <quasar-numeric :model.sync="number" class="inline" :min="2" :max="10"></quasar-numeric>
  <br><br><quasar-numeric :model.sync="number" :min="2" :max="10" :debounce="1000" :step="0.5">Number label</quasar-numeric>
  <br><br>
  <div class="list inner-delimiter bordered">
    <label class="item">
      <div class="item-content">
        <div class="item-label fixed-label">
          Some number
        </div>
        <div class="item-value">
          <quasar-numeric :model.sync="number"></quasar-numeric>
        </div>
      </div>
    </label>
    <label class="item">
      <div class="item-content">
        <div class="item-label fixed-label">
          Some number
        </div>
        <div class="item-value">
          <quasar-numeric :model.sync="number" :debounce="1000" :step="1.5">
        </div>
      </div>
    </label>
  </div>

  <h2>Textarea</h2>
  {{textarea}}
  <textarea v-model="textarea" placeholder="Textarea label"></textarea>


  <h2>Checkbox</h2>
  <quasar-checkbox :model.sync="check" style="border: 1px solid black"></quasar-checkbox>
  <quasar-checkbox :model.sync="check" class="secondary"></quasar-checkbox>
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
  <quasar-radio :model.sync="radio" value="opt2" class="secondary"></quasar-radio>
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
  <quasar-toggle :model.sync="check" class="secondary"></quasar-toggle>
  <quasar-toggle :model.sync="check" class="orange"></quasar-toggle>
  <label>
    <quasar-toggle :model.sync="check"></quasar-toggle>
    Toggle label
  </label>
  <p>
    <quasar-toggle :model.sync="check"></quasar-toggle> Inline with Text
  </p>

  <h2>Range</h2>
  [{{range.min}}, {{range.max}}] - {{range.model}}
  <br>
  <quasar-range :model.sync="range.model" :min="range.min" :max="range.max" style="border: 1px solid black"></quasar-range>
  <quasar-range :model.sync="range.model" :min="range.min" :max="range.max"></quasar-range>

  <h2>Select</h2>
  <div class="list item-delimiter bordered">
    <div class="list-header">Single Selection</div>
    <div class="item">
      <div class="item-content">
        <div class="item-label">Company</div>
        <quasar-select :model.sync="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-select>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-label">Company</div>
        <quasar-select :model.sync="select" :options="selectOptions" ok-label="Pick"></quasar-select>
      </div>
    </div>
    <div class="list-header">Multiple Selection</div>
    <div class="item">
      <div class="item-content">
        <div class="item-label">Companies</div>
        <quasar-select multiple :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-select>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-label">Companies</div>
        <quasar-select multiple :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  margin-bottom: 1rem;
}
</style>

<script>
export default {
  data () {
    return {
      check: false,
      radio: 'opt2',
      range: {
        model: 25,
        min: 20,
        max: 50
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
      textarea: '',
      number: 4
    }
  }
}
</script>
