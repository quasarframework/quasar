<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Regular (rectangle) and Circular</p>
      <p class="group">
        <button class="primary">Button</button>
        <button class="secondary circular"><i>card_giftcard</i></button>
      </p>

      <p class="caption">Small, Medium (default) and Big</p>
      <p class="group">
        <button class="primary small">Button</button>
        <button class="primary">Button</button>
        <button class="primary big">Button</button>
      </p>
      <p class="group">
        <button class="circular primary small"><i>mail</i></button>
        <button class="circular primary"><i>mail</i></button>
        <button class="circular primary big"><i>mail</i></button>
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <button class="primary">
          <i class="on-left">mail</i> On Left
        </button>
        <button class="secondary">
          On Right <i class="on-right">mail</i>
        </button>
      </p>

      <p class="caption">Color Examples</p>
      <p class="group">
        <button class="secondary">Secondary</button>
        <button class="dark">Dark</button>
        <button class="orange">Orange</button>
        <button class="light">Light</button>
        <button class="indigo">Indigo</button>
        <button class="red">Red</button>
        <button class="teal circular"><i>alarm</i></button>
      </p>

      <p class="caption">Disabled Buttons</p>
      <p class="group">
        <button class="primary disabled">Disabled</button>
        <button class="circular primary disabled"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Raised Buttons</p>
      <p class="group">
        <button class="primary raised">Raised</button>
        <button class="circular primary raised"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Clear Buttons</p>
      <p class="group">
        <button class="primary clear">Clear</button>
        <button class="circular primary clear"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <button class="primary outline">Outline</button>
        <button class="circular primary outline"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <button class="primary push">Push</button>
        <button class="circular primary push"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Bordered Buttons</p>
      <p class="group">
        <button class="light bordered">Bordered</button>
        <button class="circular light bordered"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Round Buttons (applies only to regular shaped)</p>
      <p class="group">
        <button class="primary round">Round</button>
      <p>

      <p class="caption">Glossy Buttons</p>
      <p class="group">
        <button class="primary glossy">Glossy</button>
        <button class="secondary glossy">Glossy</button>
        <button class="deep-orange glossy">Glossy</button>
        <button class="circular primary glossy"><i>card_giftcard</i></button>
        <button class="circular secondary glossy"><i>card_giftcard</i></button>
        <button class="circular deep-orange glossy"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Block Buttons</p>
      <div class="group">
        <button class="primary block">Block</button>
        <button class="secondary block">Block</button>
      </div>

      <p class="caption">Full Width Buttons</p>
      <div class="group">
        <button class="primary full-width">Full-width</button>
        <button class="secondary full-width">Full-width</button>
      </div>

      <h2>Sizes</h2>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <button class="primary" :class="size">Btn</button>
        <button class="primary" :class="size"><i class="on-left">{{ icon}}</i>Btn</button>
        <button class="primary" :class="size"><i>{{ icon}}</i></button>
        text
        <button class="primary disabled" :class="size">Disabled</button>
        <button v-for="extra in extras" class="primary" :class="[size, extra]">{{ extra}}</button>
      </template>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{ size}}</h3>
        <button class="primary circular" :class="size"><i>{{ icon}}</i></button>
        text
        <button class="primary circular disabled" :class="size"><i>{{ icon}}</i></button>
        <button v-for="extra in extras" class="primary circular" :class="[size, extra]"><i>{{ icon}}</i></button>
      </template>
      <br>
      <p>Block also adds 'display: block'</p>
      <button class="primary block">Block</button>
      <button class="primary full-width">Full-Width</button>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">Rectangular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <button :class="color">{{color}}</button>
        <button :class="color"><i class="on-left">{{icon}}</i>{{color}}</button>
        <button :class="color"><i>{{icon}}</i></button>
        text
        <button class="disabled" :class="color"><i>{{icon}}</i></button>
        <button v-for="extra in extras" :class="[color, extra]">{{color}}-{{extra}}</button>
      </template>

      <h3 class="capitalize">Circular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <button class="circular" :class="color"><i>{{icon}}</i></button>
        text
        <button class="circular disabled" :class="color"><i>{{icon}}</i></button>
        <button v-for="extra in extras" class="circular" :class="[color, extra]"><i>{{icon}}</i></button>
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
      extras: ['raised', 'clear', 'outline', 'round', 'bordered', 'push', 'glossy'],
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
