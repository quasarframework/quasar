<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Regular (rectangle) and Circular</p>
      <p class="group">
        <q-btn icon="alarm" class="orange">Icoon</q-btn>
        <q-btn iconRight="check" class="orange">Icoon</q-btn>
        <q-btn iconRight="more_horiz" class="orange">Icoon</q-btn>
        <q-btn icon="cloud" iconRight="alarm" class="orange">Icoon</q-btn>
        <q-btn icon="edit" iconRight="alarm" class="orange">Icoon</q-btn>
        <q-btn icon="edit" iconRight="alarm" class="small orange">Icoon</q-btn>
        <q-btn icon="edit" iconRight="alarm" class="big orange">Icoon</q-btn>

        <q-btn class="primary small"><q-icon name="mail" /></q-btn>
        <q-btn class="primary"><q-icon name="mail" /></q-btn>
        <q-btn class="primary big"><q-icon name="mail" /></q-btn>

        <q-btn class="circular primary small"><q-icon name="mail" /></q-btn>
        <q-btn class="circular primary"><q-icon name="mail" /></q-btn>
        <q-btn class="circular primary big"><q-icon name="mail" /></q-btn>

        <q-btn>Button</q-btn>
        <q-btn class="primary">Button</q-btn>
        <q-btn class="secondary circular"><q-icon name="card_giftcard" /></q-btn>
        <div>
          <q-icon name="alarm" style="font-size: 1.5rem" /> Block
        </div>
        <button style="border: 1px solid black">
          <q-icon name="alarm" style="font-size: 1.5rem" /> Block
        </button>

        <q-btn icon="alarm" class="orange">Icoon</q-btn>
        <q-btn iconRight="check" class="orange">Icoon</q-btn>
        <q-btn iconRight="more_horiz" class="orange">Icoon</q-btn>
        <q-btn icon="cloud" iconRight="alarm" class="orange">Icoon</q-btn>
        <q-btn icon="edit" iconRight="alarm" class="orange">Icoon</q-btn>
      </p>

      <p class="group">
        <q-btn>Button</q-btn>
        <q-btn spinner  @click="simulateProgress" class="primary">Button</q-btn>
        <q-btn spinner="audio" class="orange" @click="simulateProgress">Button</q-btn>
        <q-btn spinner="oval" class="secondary" @click="simulateProgress">Button</q-btn>
        <q-btn spinner="radio" class="amber" @click="simulateProgress">Button</q-btn>
        <q-btn spinner="oval" class="dark small" @click="simulateProgress">Button</q-btn>
        <q-btn circular spinner @click="simulateProgress" class="primary small"><q-icon name="mail" /></q-btn>
        <q-btn circular spinner @click="simulateProgress" class="primary"><q-icon name="mail" /></q-btn>
        <q-btn circular spinner @click="simulateProgress" class="primary big"><q-icon name="mail" /></q-btn>
        <q-btn class="negative" @click="stopProgress">Stop</q-btn>
      </p>

      <p class="caption">Small, Medium (default) and Big</p>
      <p class="group">
        <q-btn class="primary small">Button</q-btn>
        <q-btn class="primary">Button</q-btn>
        <q-btn class="primary big">Button</q-btn>
      </p>
      <p class="group">
        <q-btn icon="check" class="primary small">Button</q-btn>
        <q-btn icon="cloud" class="primary">Button</q-btn>
        <q-btn icon="alarm" class="primary big">Button</q-btn>
      </p>
      <p class="group">
        <q-btn class="circular primary small"><q-icon name="mail" /></q-btn>
        <q-btn class="circular primary"><q-icon name="mail" /></q-btn>
        <q-btn class="circular primary big"><q-icon name="mail" /></q-btn>
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <q-btn class="primary" icon="mail">
          On Left
        </q-btn>
        <q-btn class="secondary" iconRight="mail">
          On Right
        </q-btn>
      </p>

      <p class="caption">Color Examples</p>
      <p class="group">
        <q-btn class="secondary">Secondary</q-btn>
        <q-btn class="dark">Dark</q-btn>
        <q-btn class="orange">Orange</q-btn>
        <q-btn class="light">Light</q-btn>
        <q-btn class="indigo">Indigo</q-btn>
        <q-btn class="red">Red</q-btn>
        <q-btn class="teal circular"><q-icon name="alarm" /></q-btn>
      </p>

      <p class="caption">Disabled Buttons</p>
      <p class="group">
        <q-btn class="primary disabled">Disabled</q-btn>
        <q-btn class="circular primary disabled"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Raised Buttons</p>
      <p class="group">
        <q-btn class="primary raised">Raised</q-btn>
        <q-btn class="circular primary raised"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Clear Buttons</p>
      <p class="group">
        <q-btn class="primary clear">Clear</q-btn>
        <q-btn class="circular primary clear"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <q-btn class="primary outline">Outline</q-btn>
        <q-btn class="circular primary outline"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <q-btn class="primary push">Push</q-btn>
        <q-btn class="circular primary push"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Round Buttons (applies only to regular shaped)</p>
      <p class="group">
        <q-btn class="primary round">Round</q-btn>
      <p>

      <p class="caption">Glossy Buttons</p>
      <p class="group">
        <q-btn class="primary glossy">Glossy</q-btn>
        <q-btn class="secondary glossy">Glossy</q-btn>
        <q-btn class="deep-orange glossy">Glossy</q-btn>
        <q-btn class="circular primary glossy"><q-icon name="card_giftcard" /></q-btn>
        <q-btn class="circular secondary glossy"><q-icon name="card_giftcard" /></q-btn>
        <q-btn class="circular deep-orange glossy"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Block Buttons</p>
      <div class="group">
        <q-btn class="primary block"><q-icon name="alarm" /> Block</q-btn>
        <q-btn class="secondary block">Block</q-btn>
      </div>

      <p class="caption">Full Width Buttons</p>
      <div class="group">
        <q-btn class="primary full-width">Full-width</q-btn>
        <q-btn class="secondary full-width">Full-width</q-btn>
      </div>

      <h2>Sizes</h2>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn class="primary" :class="size">Btn</q-btn>
        <q-btn class="primary" :class="size" :icon="icon">Btn</q-btn>
        <q-btn class="primary" :class="size"><q-icon :name="icon" /></q-btn>
        text
        <q-btn class="primary disabled" :class="size">Disabled</q-btn>
        <q-btn v-for="extra in extras" :key="extra" class="primary" :class="[size, extra]">{{ extra}}</q-btn>
      </template>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{ size}}</h3>
        <q-btn class="primary circular" :class="size"><q-icon :name="icon" /></q-btn>
        text
        <q-btn class="primary circular disabled" :class="size"><q-icon :name="icon" /></q-btn>
        <q-btn v-for="extra in extras" :key="extra" class="primary circular" :class="[size, extra]"><q-icon :name="icon" /></q-btn>
      </template>
      <br>
      <p>Block also adds 'display: block'</p>
      <q-btn class="primary block">Block</q-btn>
      <q-btn class="primary full-width">Full-Width</q-btn>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">Rectangular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn :class="color">{{color}}</q-btn>
        <q-btn :class="color" :icon="icon">{{color}}</q-btn>
        <q-btn :class="color"><q-icon :name="icon" /></q-btn>
        <q-btn class="disabled" :class="color"><q-icon :name="icon" /></q-btn>
        <q-btn v-for="extra in extras" :key="extra" :class="[color, extra]">{{color}}-{{extra}}</q-btn>
      </template>

      <h3 class="capitalize">Circular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn class="circular" :class="color"><q-icon :name="icon" /></q-btn>
        <q-btn class="circular disabled" :class="color"><q-icon :name="icon" /></q-btn>
        <q-btn v-for="extra in extras" :key="extra" class="circular" :class="[color, extra]"><q-icon :name="icon" /></q-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: 'alarm',
      sizes: ['small', 'medium', 'big'],
      colors: [
        'primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info', 'white', 'light', 'dark',
        'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'
      ],
      extras: ['raised', 'clear', 'outline', 'round', 'push', 'glossy'],
      done: []
    }
  },
  methods: {
    simulateProgress (e, done) {
      this.done.push(done)
    },
    stopProgress () {
      if (this.done.length) {
        this.done.forEach(d => d())
      }
      this.done = []
    }
  }
}
</script>

<style scoped>
button {
  margin: 2px;
}
</style>
