<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Regular (rectangle) and Circular</p>
      <p class="group">
        <q-btn>Button</q-btn>
        <q-btn class="primary">Button</q-btn>
        <q-btn class="secondary circular"><i>card_giftcard</i></q-btn>
      </p>

      <p class="caption">Small, Medium (default) and Big</p>
      <p class="group">
        <q-btn class="primary small">Button</q-btn>
        <q-btn class="primary">Button</q-btn>
        <q-btn class="primary big">Button</q-btn>
      </p>
      <p class="group">
        <q-btn class="circular primary small"><i>mail</i></q-btn>
        <q-btn class="circular primary"><i>mail</i></q-btn>
        <q-btn class="circular primary big"><i>mail</i></q-btn>
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <q-btn class="primary">
          <i class="on-left">mail</i> On Left
        </q-btn>
        <q-btn class="secondary">
          On Right <i class="on-right">mail</i>
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
        <q-btn class="teal circular"><i>alarm</i></q-btn>
      </p>

      <p class="caption">Disabled Buttons</p>
      <p class="group">
        <q-btn class="primary disabled">Disabled</q-btn>
        <q-btn class="circular primary disabled"><i>card_giftcard</i></q-btn>
      <p>

      <p class="caption">Raised Buttons</p>
      <p class="group">
        <q-btn class="primary raised">Raised</q-btn>
        <q-btn class="circular primary raised"><i>card_giftcard</i></q-btn>
      <p>

      <p class="caption">Clear Buttons</p>
      <p class="group">
        <q-btn class="primary clear">Clear</q-btn>
        <q-btn class="circular primary clear"><i>card_giftcard</i></q-btn>
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <q-btn class="primary outline">Outline</q-btn>
        <q-btn class="circular primary outline"><i>card_giftcard</i></q-btn>
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <q-btn class="primary push">Push</q-btn>
        <q-btn class="circular primary push"><i>card_giftcard</i></q-btn>
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
        <q-btn class="circular primary glossy"><i>card_giftcard</i></q-btn>
        <q-btn class="circular secondary glossy"><i>card_giftcard</i></q-btn>
        <q-btn class="circular deep-orange glossy"><i>card_giftcard</i></q-btn>
      <p>

      <p class="caption">Block Buttons</p>
      <i style="font-size: 1.5rem">alarm</i> Block
      <div class="group">
        <q-btn class="primary block"><i>alarm</i> Block</q-btn>
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
        <q-btn class="primary" :class="size"><i class="on-left">{{ icon}}</i>Btn</q-btn>
        <q-btn class="primary" :class="size"><i>{{ icon}}</i></q-btn>
        text
        <q-btn class="primary disabled" :class="size">Disabled</q-btn>
        <q-btn v-for="extra in extras" class="primary" :class="[size, extra]">{{ extra}}</q-btn>
      </template>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{ size}}</h3>
        <q-btn class="primary circular" :class="size"><i>{{ icon}}</i></q-btn>
        text
        <q-btn class="primary circular disabled" :class="size"><i>{{ icon}}</i></q-btn>
        <q-btn v-for="extra in extras" class="primary circular" :class="[size, extra]"><i>{{ icon}}</i></q-btn>
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
        <q-btn :class="color"><i class="on-left">{{icon}}</i>{{color}}</q-btn>
        <q-btn :class="color"><i>{{icon}}</i></q-btn>
        <q-btn class="disabled" :class="color"><i>{{icon}}</i></q-btn>
        <q-btn v-for="extra in extras" :class="[color, extra]">{{color}}-{{extra}}</q-btn>
      </template>

      <h3 class="capitalize">Circular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn class="circular" :class="color"><i>{{icon}}</i></q-btn>
        <q-btn class="circular disabled" :class="color"><i>{{icon}}</i></q-btn>
        <q-btn v-for="extra in extras" class="circular" :class="[color, extra]"><i>{{icon}}</i></q-btn>
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
      progressBtn: 0
    }
  },
  methods: {
    workButton () {
      this.stopWorkButton()

      this.progressBtn = 0
      this.workingButton = setInterval(() => {
        this.progressBtn += 16
        if (this.progressBtn >= 100) {
          this.stopWorkButton()
        }
      }, 500)
    },
    stopWorkButton () {
      clearInterval(this.workingButton)
      this.workingButton = null
    }
  }
}
</script>

<style scoped>
button {
  margin: 2px;
}
</style>
