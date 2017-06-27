<template>
  <div>
    <div class="layout-padding buttons-test">
      <p class="caption">Regular (rectangle) and Circular</p>
      <q-btn color="primary">Some very, but very long button title that should wrap to the next line without any problems</q-btn>
      <p class="group">
        <q-btn icon="alarm" color="orange">Icoon</q-btn>
        <q-btn icon="alarm" color="orange">Icoon</q-btn>
        <q-btn icon="ion-shuffle">Icoon</q-btn>
        <q-btn icon="fa-bath">Icoon</q-btn>
        <q-btn icon-right="check">Icoon</q-btn>
        <q-btn icon-right="more_horiz">Icoon</q-btn>
        <q-btn icon="cloud" icon-right="alarm">Icoon</q-btn>
        <q-btn icon="edit" icon-right="alarm">Icoon</q-btn>
        <q-btn icon="edit" icon-right="alarm" small>Icoon</q-btn>
        <q-btn icon="edit" icon-right="alarm" big color="amber">Icoon</q-btn>

        <q-btn small color="primary"><q-icon name="mail" /></q-btn>
        <q-btn color="primary"><q-icon name="mail" /></q-btn>
        <q-btn big color="primary"><q-icon name="mail" /></q-btn>

        <q-btn round color="primary" small><q-icon name="mail" /></q-btn>
        <q-btn round color="primary"><q-icon name="mail" /></q-btn>
        <q-btn round color="primary" big><q-icon name="mail" /></q-btn>

        <q-btn>Button</q-btn>
        <q-btn color="amber">Button</q-btn>
        <q-btn round color="secondary"><q-icon name="card_giftcard" /></q-btn>

        <q-btn icon="alarm">Icoon</q-btn>
        <q-btn icon-right="check">Icoon</q-btn>
        <q-btn icon="ion-shuffle">Icoon</q-btn>
        <q-btn icon="fa-bath">Icoon</q-btn>
        <q-btn icon-right="more_horiz">Icoon</q-btn>
        <q-btn icon="cloud" icon-right="alarm">Icoon</q-btn>
        <q-btn icon="edit" icon-right="alarm">Icoon</q-btn>
      </p>

      <p class="group">
        <q-btn loader @click="simulateProgress">
          Button
          <q-spinner-oval slot="loading" />
        </q-btn>
        <q-btn loader  @click="simulateProgress">
          Button
          <span slot="loading">Loading...</span>
        </q-btn>
        <q-btn loader color="orange" @click="simulateProgress">Button</q-btn>
        <q-btn loader color="secondary" @click="simulateProgress">Button</q-btn>
        <q-btn loader color="amber" @click="simulateProgress">Button</q-btn>
        <q-btn loader color="dark" small @click="simulateProgress">Button</q-btn>
        <q-btn small round loader @click="simulateProgress" color="primary"><q-icon name="mail" /></q-btn>
        <q-btn round loader @click="simulateProgress" color="primary"><q-icon name="mail" /></q-btn>
        <q-btn big round loader @click="simulateProgress" color="primary"><q-icon name="mail" /></q-btn>

        <q-btn color="dark" small @click="simulateProgress" icon-right="alarm">
          Button
          <q-spinner-audio slot="loading" />
        </q-btn>
        <q-btn round @click="simulateProgress" color="primary" big>
          <q-spinner-audio slot="loading" />
          <q-icon name="alarm" />
        </q-btn>
        <q-btn color="negative" @click="stopProgress">Stop</q-btn>
      </p>

      <p class="group">
        <q-btn loader :percentage="percentage" color="primary" @click="startProgress">
          Btn with progress
          <span slot="loading">
            <q-spinner class="on-left" />
            Computing...
          </span>
        </q-btn>

        <q-btn round loader :percentage="percentage" color="primary" @click="startProgress" icon="wifi" />
      </p>

      <p class="caption">Small, Medium (default) and Big</p>
      <p class="group">
        <q-btn small color="primary">Button</q-btn>
        <q-btn color="primary">Button</q-btn>
        <q-btn big color="primary">Button</q-btn>
      </p>
      <p class="group">
        <q-btn icon="check" small color="primary">Button</q-btn>
        <q-btn icon="cloud" color="primary">Button</q-btn>
        <q-btn icon="alarm" big color="primary">Button</q-btn>
      </p>
      <p class="group">
        <q-btn round small icon="check" color="primary"></q-btn>
        <q-btn round icon="cloud" color="primary"></q-btn>
        <q-btn round big icon="alarm" color="primary"></q-btn>
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <q-btn color="primary" icon="mail">
          On Left
        </q-btn>
        <q-btn color="secondary" icon-right="mail">
          On Right
        </q-btn>
      </p>

      <p class="caption">Color Examples</p>
      <p class="group">
        <q-btn color="secondary">Secondary</q-btn>
        <q-btn color="dark">Dark</q-btn>
        <q-btn color="orange">Orange</q-btn>
        <q-btn color="light" class="text-black">Light</q-btn>
        <q-btn color="indigo">Indigo</q-btn>
        <q-btn color="red">Red</q-btn>
        <q-btn round color="teal"><q-icon name="alarm" /></q-btn>
      </p>
      <p class="caption">Custom Color Examples</p>
      <p class="group">
        <q-btn flat style="color: #FF0080">Fuchsia Flat</q-btn>
        <q-btn style="background: #FF0080; color: white">Fuchsia</q-btn>
        <q-btn style="background: goldenrod; color: white">Goldenrod</q-btn>
        <q-btn outline style="color: goldenrod;">Goldenrod</q-btn>
      </p>

      <p class="caption">Disabled Buttons</p>
      <p class="group">
        <q-btn color="primary" disable>Disabled</q-btn>
        <q-btn round color="primary" disable><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Flat Buttons</p>
      <p class="group">
        <q-btn flat color="primary">Flat</q-btn>
        <q-btn flat round color="primary"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <q-btn outline color="primary">Outline</q-btn>
        <q-btn round outline color="primary"><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <q-btn push color="primary">Push</q-btn>
        <q-btn push color="primary" round><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Round Buttons</p>
      <p class="group">
        <q-btn round color="secondary" icon="alarm"></q-btn>
      <p>

      <p class="caption">Glossy Buttons</p>
      <p class="group">
        <q-btn color="primary" glossy>Glossy</q-btn>
        <q-btn color="secondary" glossy>Glossy</q-btn>
        <q-btn color="deep-orange" glossy>Glossy</q-btn>
        <q-btn round color="primary" glossy><q-icon name="card_giftcard" /></q-btn>
        <q-btn round color="secondary" glossy><q-icon name="card_giftcard" /></q-btn>
        <q-btn round color="deep-orange" glossy><q-icon name="card_giftcard" /></q-btn>
      <p>

      <p class="caption">Block Buttons</p>
      <div class="group">
        <q-btn color="primary" class="block" icon="alarm">Block</q-btn>
        <q-btn color="secondary" class="block">Block</q-btn>
      </div>

      <p class="caption">Full Width Buttons</p>
      <div class="group">
        <q-btn color="primary" class="full-width">Full-width</q-btn>
        <q-btn color="secondary" class="full-width">Full-width</q-btn>
      </div>

      <h2>Sizes</h2>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn color="primary" :small="size === 'small'" :big="size === 'big'">Btn</q-btn>
        <q-btn color="primary" :small="size === 'small'" :big="size === 'big'" :icon="icon">Btn</q-btn>
        <q-btn color="primary" :small="size === 'small'" :big="size === 'big'"><q-icon :name="icon" /></q-btn>
        text
        <q-btn class="bg-primary text-white disabled" :small="size === 'small'" :big="size === 'big'">Disabled</q-btn>
        <q-btn
          v-for="extra in extras"
          :key="extra"
          color="primary"
          :small="size === 'small'"
          :big="size === 'big'"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
        >{{extra}}</q-btn>
      </template>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn color="primary" round :small="size === 'small'" :big="size === 'big'"><q-icon :name="icon" /></q-btn>
        text
        <q-btn color="primary" round disable :small="size === 'small'" :big="size === 'big'"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          :key="extra"
          color="primary"
          round
          :small="size === 'small'"
          :big="size === 'big'"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
        ><q-icon :name="icon" /></q-btn>
      </template>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">Rectangular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn :color="color">{{color}}</q-btn>
        <q-btn :color="color" :icon="icon">{{color}}</q-btn>
        <q-btn :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn class="disabled" :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          :key="extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
        >{{color}}-{{extra}}</q-btn>
      </template>

      <h3 class="capitalize">Circular</h3>
      <template v-for="color in colors">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn round :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn round disable :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          round
          :key="extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
          icon="wifi"
        ></q-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: 'alarm',
      sizes: ['small', 'standard', 'big'],
      colors: [
        'primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info', '', 'light', 'dark',
        'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'
      ],
      extras: ['flat', 'outline', 'round', 'rounded', 'push', 'glossy'],
      done: [],
      percentage: 0
    }
  },
  methods: {
    startProgress (e, done) {
      this.percentage = 0
      this.interval = setInterval(() => {
        this.percentage += Math.floor(Math.random() * 8 + 10)
        if (this.percentage >= 100) {
          clearInterval(this.interval)
          done()
        }
      }, 700)
    },
    simulateProgress (e, done) {
      this.done.push(done)
    },
    stopProgress () {
      if (this.done.length) {
        this.done.forEach(d => d())
      }
      this.done = []
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>
