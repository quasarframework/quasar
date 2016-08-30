<template>
  <div>
    <button class="primary block">.block</button>
    <button class="secondary block">.block</button>
  </div>
  <div class="row group">
    <button class="primary">btn</button>
    <button class="tertiary auto">.auto in a .row container</button>
  </div>
  <button class="primary full-width">.full-width</button>

  <h2>Sizes</h2>
  <template v-for="size in sizes">
    <h3 class="capitalize">{{* size}}</h3>
    <button class="primary" :class.once="size">Btn</button>
    <button class="primary" :class.once="size"><i class="on-left">{{* icon}}</i>Btn</button>
    <button class="primary" :class.once="size"><i>{{* icon}}</i></button>
    text
    <button class="primary disabled" :class.once="size">Disabled</button>
    <button v-for="extra in extras" class="primary" :class.once="[size, extra]">{{* extra}}</button>
  </template>
  <template v-for="size in sizes">
    <h3 class="capitalize">{{* size}}</h3>
    <button class="primary circular" :class.once="size"><i>{{* icon}}</i></button>
    text
    <button class="primary circular disabled" :class.once="size"><i>{{* icon}}</i></button>
    <button v-for="extra in extras" class="primary circular" :class.once="[size, extra]"><i>{{* icon}}</i></button>
  </template>
  <br>
  <p>Block also adds 'display: block'</p>
  <button class="primary block">Block</button>
  <button class="primary full-width">Full-Width</button>
  <br><br>
  <h2>Types</h2>
  <h3 class="capitalize">Rectangular</h3>
  <template v-for="color in colors">
    <h4 class="capitalize">{{* color}}</h4>
    <button :class.once="color">{{* color}}</button>
    <button :class.once="color"><i class="on-left">{{* icon}}</i>{{* color}}</button>
    <button :class.once="color"><i>{{* icon}}</i></button>
    text
    <button class="disabled" :class.once="color"><i>{{* icon}}</i></button>
    <button v-for="extra in extras" :class.once="[color, extra]">{{* color}}-{{* extra}}</button>
  </template>

  <h3 class="capitalize">Circular</h3>
  <template v-for="color in colors">
    <h4 class="capitalize">{{* color}}</h4>
    <button class="circular" :class.once="color"><i>{{* icon}}</i></button>
    text
    <button class="circular disabled" :class.once="color"><i>{{* icon}}</i></button>
    <button v-for="extra in extras" class="circular" :class.once="[color, extra]"><i>{{* icon}}</i></button>
  </template>


  <h2>Group</h2>
  <div class="group">
    <button class="primary">Button 1</button>
    <button class="primary">Button 1</button>
    <button class="primary">Button 1</button>
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
      extras: ['raised', 'clear', 'outline', 'round', 'bordered', 'push', 'glossy']
    }
  }
}
</script>

<style scoped>
button {
  margin: 2px;
}
</style>
