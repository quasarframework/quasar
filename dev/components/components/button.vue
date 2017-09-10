<template>
  <div>
    <div class="layout-padding buttons-test">
      <p class="caption">Regular (rectangle) and Circular</p>
      <q-btn color="primary">Some very, but very long button title that should wrap to the next line without any problems</q-btn>
      <p class="group">
        <q-btn icon="alarm" color="orange" label="Icoon" />
        <q-btn icon="alarm" color="orange" label="Icoon" />
        <q-btn icon="ion-shuffle" label="Icoon" />
        <q-btn icon="fa-bath" label="Icoon" />
        <q-btn icon-right="check" label="Icoon" />
        <q-btn icon-right="more_horiz" label="Icoon" />
        <q-btn icon="cloud" icon-right="alarm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" small label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" big color="amber" label="Icoon" />

        <q-btn small color="primary" icon="mail" />
        <q-btn color="primary" icon="mail" />
        <q-btn big color="primary" icon="mail" />

        <q-btn round color="primary" small icon="mail" />
        <q-btn round color="primary" icon="mail" />
        <q-btn round color="primary" big icon="mail" />

        <q-btn label="Button" />
        <q-btn color="amber" label="Button" />
        <q-btn round color="secondary" icon="card_giftcard" />

        <q-btn icon="alarm" label="Icoon" />
        <q-btn icon-right="check" label="Icoon" />
        <q-btn icon="ion-shuffle" label="Icoon" />
        <q-btn icon="fa-bath" label="Icoon" />
        <q-btn icon-right="more_horiz" label="Icoon" />
        <q-btn icon="cloud" icon-right="alarm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" label="Icoon" />
      </p>

      <p class="group">
        <q-btn loader @click="simulateProgress" label="Button">
          <q-spinner-oval slot="loading" />
        </q-btn>
        <q-btn loader  @click="simulateProgress" label="Button">
          <span slot="loading">Loading...</span>
        </q-btn>
        <q-btn loader color="orange" @click="simulateProgress" label="Button" />
        <q-btn loader color="secondary" @click="simulateProgress" label="Button" />
        <q-btn loader color="amber" @click="simulateProgress" label="Button" />
        <q-btn loader color="dark" small @click="simulateProgress" label="Button" />
        <q-btn small round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn big round loader @click="simulateProgress" color="primary" icon="mail" />

        <q-btn color="dark" small @click="simulateProgress" icon-right="alarm" label="Button">
          <q-spinner-audio slot="loading" />
        </q-btn>
        <q-btn round @click="simulateProgress" color="primary" big icon="alarm">
          <q-spinner-audio slot="loading" />
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
        <q-btn small color="primary" label="Button" />
        <q-btn color="primary" label="Button" />
        <q-btn big color="primary" label="Button" />
      </p>
      <p class="group">
        <q-btn icon="check" small color="primary" label="Button" />
        <q-btn icon="cloud" color="primary" label="Button" />
        <q-btn icon="alarm" big color="primary" label="Button" />
      </p>
      <p class="group">
        <q-btn round small icon="check" color="primary" />
        <q-btn round icon="cloud" color="primary" />
        <q-btn round big icon="alarm" color="primary" />
      </p>

      <p class="caption">Compact - Small, Medium (default) and Big</p>
      <p class="group">
        <q-btn compact small color="primary" label="Button" />
        <q-btn compact color="primary" label="Button" />
        <q-btn compact big color="primary" label="Button" />
      </p>
      <p class="group">
        <q-btn compact icon="check" small color="primary" label="Button" />
        <q-btn compact icon="cloud" color="primary" label="Button" />
        <q-btn compact icon="alarm" big color="primary" label="Button" />
      </p>
      <p class="group">
        <q-btn compact round small icon="check" color="primary" />
        <q-btn compact round icon="cloud" color="primary" />
        <q-btn compact round big icon="alarm" color="primary" />
      </p>

      <p class="caption">Regular with Icons</p>
      <p class="group">
        <q-btn color="primary" icon="mail" label="On Left" />
        <q-btn color="secondary" icon-right="mail" label="On Right" />
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
        <q-btn round color="primary" disable icon="card_giftcard" />
      <p>

      <p class="caption">Flat Buttons</p>
      <p class="group">
        <q-btn flat color="primary">Flat</q-btn>
        <q-btn flat round color="primary" icon="card_giftcard" />
      <p>

      <p class="caption">Outline Buttons</p>
      <p class="group">
        <q-btn outline color="primary">Outline</q-btn>
        <q-btn round outline color="primary" icon="card_giftcard" />
      <p>

      <p class="caption">Push Buttons</p>
      <p class="group">
        <q-btn push color="primary">Push</q-btn>
        <q-btn push color="primary" round icon="card_giftcard" />
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
        <q-btn round color="primary" glossy icon="card_giftcard" />
        <q-btn round color="secondary" glossy icon="card_giftcard" />
        <q-btn round color="deep-orange" glossy icon="card_giftcard" />
      <p>

      <p class="caption">Block Buttons</p>
      <div class="group">
        <q-btn color="primary" class="block" icon="alarm" label="Block" />
        <q-btn color="secondary" class="block" label="Block" />
      </div>

      <p class="caption">Full Width Buttons</p>
      <div class="group">
        <q-btn color="primary" class="full-width">Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width</q-btn>
        <q-btn color="secondary" class="full-width">Full-width</q-btn>
      </div>

      <p class="caption">Wrap test</p>
      <div class="group" style="width: 610px">
        <q-btn color="primary">Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width</q-btn>
        <q-btn color="primary" no-wrap>No wrap. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width</q-btn>
        <q-btn color="primary" no-wrap label="No wrap with label prop. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
      </div>

      <h2>Sizes</h2>
      <template v-for="size in sizes">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn color="primary" :small="size === 'small'" :big="size === 'big'" label="Btn" />
        <q-btn color="primary" :small="size === 'small'" :big="size === 'big'" :icon="icon" label="Btn" />
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
        <q-btn :color="color" :icon="icon" :label="color" />
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
        />
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
