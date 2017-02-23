<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Regular (rectangle) and Circular</p>
      <p class="group">
        <button tabindex="0" class="primary">Button</button>
        <button tabindex="0" class="secondary circular"><i>card_giftcard</i></button>
      </p>

      <p class="caption">Small, Medium (default) and Big</p>
      <p class="group">
        <button tabindex="0" class="primary small">Button</button>
        <button tabindex="0" class="primary">Button</button>
        <button tabindex="0" class="primary big">Button</button>
      </p>
      <p class="group">
        <button tabindex="0" class="circular primary small"><i>mail</i></button>
        <button tabindex="0" class="circular primary"><i>mail</i></button>
        <button tabindex="0" class="circular primary big"><i>mail</i></button>
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <button tabindex="0" class="primary">
          <i class="on-left">mail</i> On Left
        </button>
        <button tabindex="0" class="secondary">
          On Right <i class="on-right">mail</i>
        </button>
      </p>

      <p class="caption">Color Examples</p>
      <p class="group">
        <button tabindex="0" class="secondary">Secondary</button>
        <button tabindex="0" class="dark">Dark</button>
        <button tabindex="0" class="orange">Orange</button>
        <button tabindex="0" class="light">Light</button>
        <button tabindex="0" class="indigo">Indigo</button>
        <button tabindex="0" class="red">Red</button>
        <button tabindex="0" class="teal circular"><i>alarm</i></button>
      </p>

      <p class="caption">Disabled Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary disabled">Disabled</button>
        <button tabindex="0" class="circular primary disabled"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Raised Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary raised">Raised</button>
        <button tabindex="0" class="circular primary raised"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Clear Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary clear">Clear</button>
        <button tabindex="0" class="circular primary clear"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary outline">Outline</button>
        <button tabindex="0" class="circular primary outline"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary push">Push</button>
        <button tabindex="0" class="circular primary push"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Bordered Buttons</p>
      <p class="group">
        <button tabindex="0" class="light bordered">Bordered</button>
        <button tabindex="0" class="circular light bordered"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Round Buttons (applies only to regular shaped)</p>
      <p class="group">
        <button tabindex="0" class="primary round">Round</button>
      <p>

      <p class="caption">Glossy Buttons</p>
      <p class="group">
        <button tabindex="0" class="primary glossy">Glossy</button>
        <button tabindex="0" class="secondary glossy">Glossy</button>
        <button tabindex="0" class="deep-orange glossy">Glossy</button>
        <button tabindex="0" class="circular primary glossy"><i>card_giftcard</i></button>
        <button tabindex="0" class="circular secondary glossy"><i>card_giftcard</i></button>
        <button tabindex="0" class="circular deep-orange glossy"><i>card_giftcard</i></button>
      <p>

      <p class="caption">Block Buttons</p>
      <i style="font-size: 1.5rem">alarm</i> Block
      <div class="group">
        <button tabindex="0" class="primary block"><i>alarm</i> Block</button>
        <button tabindex="0" class="secondary block">Block</button>
      </div>

      <p class="caption">Full Width Buttons</p>
      <div class="group">
        <button tabindex="0" class="primary full-width">Full-width</button>
        <button tabindex="0" class="secondary full-width">Full-width</button>
      </div>

      <h2>Sizes</h2>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <button tabindex="0" class="primary" :class="size">Btn</button>
        <button tabindex="0" class="primary" :class="size"><i class="on-left">{{ icon}}</i>Btn</button>
        <button tabindex="0" class="primary" :class="size"><i>{{ icon}}</i></button>
        text
        <button tabindex="0" class="primary disabled" :class="size">Disabled</button>
        <button tabindex="0" v-for="extra in extras" class="primary" :class="[size, extra]">{{ extra}}</button>
      </template>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{ size}}</h3>
        <button tabindex="0" class="primary circular" :class="size"><i>{{ icon}}</i></button>
        text
        <button tabindex="0" class="primary circular disabled" :class="size"><i>{{ icon}}</i></button>
        <button tabindex="0" v-for="extra in extras" class="primary circular" :class="[size, extra]"><i>{{ icon}}</i></button>
      </template>
      <br>
      <p>Block also adds 'display: block'</p>
      <button tabindex="0" class="primary block">Block</button>
      <button tabindex="0" class="primary full-width">Full-Width</button>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">Rectangular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <button tabindex="0" :class="color">{{color}}</button>
        <button tabindex="0" :class="color"><i class="on-left">{{icon}}</i>{{color}}</button>
        <button tabindex="0" :class="color"><i>{{icon}}</i></button>
        text
        <button tabindex="0" class="disabled" :class="color"><i>{{icon}}</i></button>
        <button tabindex="0" v-for="extra in extras" :class="[color, extra]">{{color}}-{{extra}}</button>
      </template>

      <h3 class="capitalize">Circular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <button tabindex="0" class="circular" :class="color"><i>{{icon}}</i></button>
        text
        <button tabindex="0" class="circular disabled" :class="color"><i>{{icon}}</i></button>
        <button tabindex="0" v-for="extra in extras" class="circular" :class="[color, extra]"><i>{{icon}}</i></button>
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
