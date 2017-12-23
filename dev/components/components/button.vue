<template>
  <div>
    <div class="layout-padding buttons-test">

      <p class="group">
        <template v-for="n in ['xs', 'sm', 'dense', 'md', 'lg', 'xl']">
          <span :key="'d0'+n">{{n}}</span>
          <q-btn :key="'d1'+n" :size="n" icon="android" color="primary" compact />
          <q-btn :key="'d2'+n" :size="n" icon="android" color="primary" />
          <q-btn :key="'d3'+n" :size="n" icon="android" color="primary" label="Test" compact />
          <q-btn :key="'d3'+n" :size="n" icon="android" color="primary" label="Test"/>
          <q-btn :key="'d4'+n" :size="n" round icon="android" color="primary" />
          <q-btn :key="'d5'+n" :size="n" round icon="android" color="primary" mini />
          <q-btn :key="'d6'+n" :size="n" label="Test" color="primary" compact />
          <q-btn :key="'d7'+n" :size="n" label="Test" color="primary" />
          <br :key="'d8'+n"><br :key="'d9'+n">
        </template>
      </p>
      <p class="group">
        <template v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']">
          <span :key="'dp0'+n">Padding {{n}}</span>
          <q-btn :key="'dp1'+n" :class="'q-pa-'+n" icon="android" color="primary" />
          <q-btn :key="'dp2'+n" :class="'q-pa-'+n" icon="android" color="primary" label="Test"/>
          <q-btn :key="'dp3'+n" :class="'q-pa-'+n" round icon="android" color="primary" />
          <q-btn :key="'dp4'+n" :class="'q-pa-'+n" label="Test" color="primary" />
          <br :key="'dp5'+n"><br :key="'dp6'+n">
        </template>
      </p>
      <q-toolbar color="secondary" style="width: 500px">
        <q-btn flat round icon="menu" />
        <q-btn flat round icon="android" />
        <q-btn flat icon="assignment_ind" />
        <q-btn flat icon="android" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <span>
          <q-btn flat icon="sim_card" compact />
        </span>
        <q-btn flat icon="gamepad" />
      </q-toolbar>
      <q-toolbar color="primary" style="width: 500px">
        <q-btn flat size="dense" icon="menu" />
        <q-btn flat size="dense" icon="android" />
        <q-btn flat size="dense" icon="assignment_ind" />
        <q-btn flat size="dense" icon="android" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <span>
          <q-btn flat size="dense" icon="sim_card" compact />
        </span>
        <q-btn flat size="dense" icon="gamepad" />
      </q-toolbar>

      <p class="caption">Regular (rectangle) and Circular</p>
      <p class="group">
        <q-btn color="primary">Some very, but very long button title that should wrap to the next line without any problems</q-btn>
        <q-btn icon="alarm" color="orange" label="No ripple" no-ripple />
        <q-btn icon="alarm" color="orange" label="Icoon" />
        <q-btn icon="ion-shuffle" label="Icoon" />
        <q-btn icon="fa-bath" label="Icoon" />
        <q-btn icon-right="check" label="Icoon" />
        <q-btn icon-right="more_horiz" label="Icoon" />
        <q-btn icon="cloud" icon-right="alarm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" size="sm" label="Icoon" />
        <q-btn icon="edit" icon-right="alarm" size="lg" color="amber" label="Icoon" />

        <q-btn size="sm" color="primary" icon="mail" title="Size sm" />
        <q-btn color="primary" icon="mail" />
        <q-btn size="lg" color="primary" icon="mail" />

        <q-btn round color="primary" size="sm" icon="mail" />
        <q-btn round color="primary" icon="mail" />
        <q-btn round color="primary" size="lg" icon="mail" />

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
        <q-btn loader color="dark" size="xs" @click="simulateProgress" label="Button" />
        <q-btn loader color="dark" size="sm" @click="simulateProgress" label="Button" />
        <q-btn loader color="dark" size="md" @click="simulateProgress" label="Button" />
        <q-btn loader color="dark" size="lg" @click="simulateProgress" label="Button" />
        <q-btn loader color="dark" size="xl" @click="simulateProgress" label="Button" />
        <q-btn size="xs" round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn size="sm" round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn size="lg" round loader @click="simulateProgress" color="primary" icon="mail" />
        <q-btn size="xl" round loader @click="simulateProgress" color="primary" icon="mail" />

        <q-btn color="dark" size="sm" @click="simulateProgress" icon-right="alarm" label="Button">
          <q-spinner-audio slot="loading" />
        </q-btn>
        <q-btn round @click="simulateProgress" color="primary" size="lg" icon="alarm">
          <q-spinner-audio slot="loading" />
        </q-btn>
        <q-btn color="negative" @click="stopProgress">Stop</q-btn>
      </p>

      <p class="group">
        <q-btn color="primary" icon="alarm" label="Label" />
        <q-btn color="primary" iconRight="alarm" label="Label" />
        <q-btn color="primary" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn color="primary" icon="alarm" icon-right="alarm" />
        <q-btn color="secondary" icon="alarm" label="Label">Slot</q-btn>
        <q-btn color="secondary" iconRight="alarm" label="Label">Slot</q-btn>
        <q-btn color="secondary" icon="alarm" icon-right="alarm" label="Label">Slot</q-btn>
        <q-btn color="secondary" icon="alarm" icon-right="alarm">Slot</q-btn>
        <q-btn color="positive" icon="alarm" label="Label"></q-btn>
        <q-btn color="positive" iconRight="alarm" label="Label"></q-btn>
        <q-btn color="positive" icon="alarm" icon-right="alarm" label="Label"></q-btn>
        <q-btn color="positive" icon="alarm" icon-right="alarm"></q-btn>
        <q-btn color="negative" icon="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn color="negative" iconRight="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn color="negative" icon="alarm" icon-right="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn color="negative" icon="alarm" icon-right="alarm"><q-tooltip>Popover</q-tooltip></q-btn>
      </p>
      <p class="group">
        <q-btn round color="primary" icon="alarm" label="Label" />
        <q-btn round color="primary" iconRight="alarm" label="Label" />
        <q-btn round color="primary" icon="alarm" icon-right="alarm" label="Label" />
        <q-btn round color="primary" icon="alarm" icon-right="alarm" />
        <q-btn round color="positive" icon="alarm" label="Label"></q-btn>
        <q-btn round color="positive" iconRight="alarm" label="Label"></q-btn>
        <q-btn round color="positive" icon="alarm" icon-right="alarm" label="Label"></q-btn>
        <q-btn round color="positive" icon="alarm" icon-right="alarm"></q-btn>
        <q-btn round color="negative" icon="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn round color="negative" iconRight="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn round color="negative" icon="alarm" icon-right="alarm" label="Label"><q-tooltip>Popover</q-tooltip></q-btn>
        <q-btn round color="negative" icon="alarm" icon-right="alarm"><q-tooltip>Popover</q-tooltip></q-btn>
      </p>

      <p class="group">
        <q-btn loader :percentage="percentage" color="primary" @click="startProgress">
          Btn with progress
          <span slot="loading" class="row items-center">
            <q-spinner class="on-left" />
            Computing...
          </span>
        </q-btn>

        <q-btn round loader :percentage="percentage" color="primary" @click="startProgress" icon="wifi" />
      </p>

      <p class="caption">Normal: xs, sm, dense, md (default), lg, xl</p>
      <p class="group">
        <q-btn size="xs" color="primary" label="Button xs" />
        <q-btn size="sm" color="primary" label="Button sm" />
        <q-btn size='dense' color="primary" label="Button dense" />
        <q-btn color="primary" label="Button md" />
        <q-btn size="lg" color="primary" label="Button lg" />
        <q-btn size="xl" color="primary" label="Button xl" />
      </p>
      <p class="group">
        <q-btn icon="check" size="xs" color="primary" label="Button xs" />
        <q-btn icon="check" size="sm" color="primary" label="Button sm" />
        <q-btn icon="check" size="dense" color="primary" label="Button dense" />
        <q-btn icon="cloud" color="primary" label="Button md" />
        <q-btn icon="alarm" size="lg" color="primary" label="Button lg" />
        <q-btn icon="alarm" size="xl" color="primary" label="Button xl" />
      </p>
      <p class="group">
        <q-btn round size="xs" icon="check" color="primary" />
        <q-btn round size="sm" icon="check" color="primary" />
        <q-btn round icon="cloud" color="primary" />
        <q-btn round size="lg" icon="alarm" color="primary" />
        <q-btn round size="xl" icon="alarm" color="primary" />
      </p>

      <p class="caption">Compact: xs, sm, dense, md (default), lg, xl</p>
      <p class="group">
        <q-btn compact size="xs" color="primary" label="Button xs compact" />
        <q-btn compact size="sm" color="primary" label="Button sm compact" />
        <q-btn compact size='dense' color="primary" label="Button dense compact" />
        <q-btn compact color="primary" label="Button md compact" />
        <q-btn compact size="lg" color="primary" label="Button lg compact" />
        <q-btn compact size="xl" color="primary" label="Button xl compact" />
      </p>
      <p class="group">
        <q-btn compact icon="check" size="xs" color="primary" label="Button xs compact" />
        <q-btn compact icon="check" size="sm" color="primary" label="Button sm compact" />
        <q-btn compact icon="check" size="dense" color="primary" label="Button dense compact" />
        <q-btn compact icon="cloud" color="primary" label="Button md compact" />
        <q-btn compact icon="alarm" size="lg" color="primary" label="Button lg compact" />
        <q-btn compact icon="alarm" size="xl" color="primary" label="Button xl compact" />
      </p>

      <p class="group">
        <template v-for="i in 9">
          <q-btn :key="'as' + i" round icon="cloud" color="primary" :size="`${4 + 4 * i}px`" :title="`Size ${4 + 4 * i}px`" />
          <q-btn :key="'asm' + i" round mini icon="cloud" color="primary" :size="`${4 + 4 * i}px`" :title="`Size ${4 + 4 * i}px mini`" />
        </template>
      </p>
      <p class="group">
        <template v-for="size in sizes" v-if="size !== 'dense'">
          <q-btn :key="'aq' + size" round icon="cloud" color="primary" :size="size" :title="`Size ${size}`" />
          <q-btn :key="'aqm' + size" round mini icon="cloud" color="primary" :size="size" :title="`Size ${size} mini`" />
        </template>
      </p>

      <p class="group">
        <template v-for="i in 15">
          <q-btn :key="'bs' + i" :label="`Size ${6 + i}pt`" color="primary" :size="`${6 + i}pt`" />
          <q-btn :key="'bsc' + i" compact :label="`Size ${6 + i}pt compact`" color="primary" :size="`${6 + i}pt`" />
        </template>
      </p>
      <p class="group">
        <template v-for="size in sizes">
          <q-btn :key="'bq' + size" :label="`Size ${size}`" color="primary" :size="size" />
          <q-btn :key="'bqc' + size" compact :label="`Size ${size} compact`" color="primary" :size="size" />
        </template>
      </p>

      <p class="group">
        <template v-for="i in 15">
          <q-btn :key="'cs' + i" icon="cloud" :label="`Size ${6 + i}pt`" color="primary" :size="`${6 + i}pt`" />
          <q-btn :key="'csc' + i" compact icon="cloud" :label="`Size ${6 + i}pt compact`" color="primary" :size="`${6 + i}pt`" />
        </template>
      </p>
      <p class="group">
        <template v-for="size in sizes">
          <q-btn :key="'cq' + size" icon="cloud" :label="`Size ${size}`" color="primary" :size="size" />
          <q-btn :key="'cqc' + size" compact icon="cloud" :label="`Size ${size} compact`" color="primary" :size="size" />
        </template>
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
        <q-btn color="primary" icon="alarm" class="full-width">Full-width</q-btn>
        <q-btn color="secondary" icon-right="alarm" class="full-width">Full-width</q-btn>
        <q-btn color="secondary" icon="lock" icon-right="alarm" class="full-width">Full-width</q-btn>
      </div>

      <p class="caption">Multiline Buttons</p>
      <div class="group">
        <q-btn color="primary" size="sm">Small<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary">Normal<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" size="lg">Big<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm" size="sm">Small<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm">Normal<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm" size="lg">Big<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm" size="sm">Small<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm">Normal<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm" size="lg">Big<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm" size="sm">Small<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm">Normal<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm" size="lg">Big<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" class="full-width" icon="lock" icon-right="alarm" size="sm">Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.</q-btn>
        <q-btn color="primary" class="full-width" icon="lock" icon-right="alarm">Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.</q-btn>
        <q-btn color="primary" class="full-width" icon="lock" icon-right="alarm" size="lg">Very long text that should wrap on the next line. I really mean it, it's a very long text. Maybe it's not clear, but it should be very, very long, so long that even a fullscreen width is not enough. I know it's not easy, but we should try.</q-btn>
        <q-btn color="primary" size="sm" class="full-width">Small Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" class="full-width">Normal Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" size="lg" class="full-width">Big Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm" size="sm" class="full-width">Small Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm" class="full-width">Normal Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="alarm" size="lg" class="full-width">Big Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm" size="sm" class="full-width">Small Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm" class="full-width">Normal Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon-right="alarm" size="lg" class="full-width">Big Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm" size="sm" class="full-width">Small Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm" class="full-width">Normal Full-width<br/>Multiline<br/>Button</q-btn>
        <q-btn color="primary" icon="lock" icon-right="alarm" size="lg" class="full-width">Big Full-width<br/>Multiline<br/>Button</q-btn>
      </div>

      <p class="caption">Wrap test</p>
      <div class="group" style="width: 610px">
        <q-btn color="primary">Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width</q-btn>
        <q-btn color="primary" no-wrap>No wrap. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width</q-btn>
        <q-btn color="primary" no-wrap label="No wrap with label prop. Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width Full-width" />
      </div>

      <h2>Sizes</h2>
      <div v-for="size in sizes" :key="'f' + size">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn color="primary" :size="size" label="Btn" />
        <q-btn color="primary" :size="size" :icon="icon" label="Btn" />
        <q-btn color="primary" :size="size"><q-icon :name="icon" /></q-btn>
        text
        <q-btn class="bg-primary text-white disabled" :size="size">Disabled</q-btn>
        <q-btn
          v-for="extra in extras"
          :key="'g' + extra"
          color="primary"
          :size="size"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
        >{{extra}}</q-btn>
      </div>
      <div v-for="size in sizes" :key="'h' + size" v-if="size !== 'dense'">
        <h3 class="capitalize">{{size}}</h3>
        <q-btn color="primary" round :size="size"><q-icon :name="icon" /></q-btn>
        text
        <q-btn color="primary" round disable :size="size"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          :key="'i' + extra"
          color="primary"
          round
          :size="size"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
        ><q-icon :name="icon" /></q-btn>
      </div>
      <br><br>
      <h2>Types</h2>
      <h3 class="capitalize">Rectangular</h3>
      <div v-for="color in colors" :key="'j' + color">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn :color="color">{{color}}</q-btn>
        <q-btn :color="color" :icon="icon" :label="color" />
        <q-btn :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn class="disabled" :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          :key="'k' + extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
        >{{color}}-{{extra}}</q-btn>
      </div>

      <h3 class="capitalize">Circular</h3>
      <div v-for="color in colors" :key="'l' + color">
        <h4 class="capitalize">{{color}}</h4>
        <q-btn round :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn round disable :color="color"><q-icon :name="icon" /></q-btn>
        <q-btn
          v-for="extra in extras"
          round
          :key="'m' + extra"
          :color="color"
          :flat="extra === 'flat'"
          :outline="extra === 'outline'"
          :push="extra === 'push'"
          :rounded="extra === 'rounded'"
          :glossy="extra === 'glossy'"
          icon="wifi"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: 'alarm',
      sizes: ['xs', 'sm', 'dense', 'md', 'lg', 'xl'],
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
