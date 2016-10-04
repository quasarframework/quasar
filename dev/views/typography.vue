<template>

  <h1>Visibility</h1>
  <div class="label text-white bg-primary ios-only">ios</div>
  <div class="label text-white bg-primary mat-only">mat</div>
  <div class="label text-white bg-primary desktop-only">desktop</div>
  <div class="label text-white bg-primary mobile-only">mobile</div>
  <div class="label text-white bg-primary cordova-only">cordova</div>
  <div class="label text-white bg-primary touch-only">touch</div>
  <div class="label text-white bg-primary no-touch-only">no-touch</div>

  <p style="margin-top: 20px">
    <span class="desktop-only">Switch to other tab then back to see Visibility in action.</span>
    <span class="mobile-only">Switch to another App then back here to see Visibility in action.</span>
  </p>
  <p>
    <div v-for="event in visibilityEvents" track-by="$index">
      {{{ event }}}
    </div>
  </p>

  <p>
    <button class="primary" @click="toggleFullscreen"><i class="on-left">zoom_out_map</i> Toggle Fullscreen</button>
  </p>

  <h1>Header 1</h1>
  <p>Text</p>

  <h2>Header 2</h2>
  <p>Text</p>

  <h3>Header 3</h3>
  <p>Text</p>

  <h4>Header 4</h4>
  <p>Text</p>

  <h5>Header 5</h5>
  <p>Text</p>

  <h6>Header 6</h6>
  <p>Text</p>

  <p><small>Small</small> <big>Big</big></p>
  <p><strong>Normal</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
  <p class="caption"><strong>Caption</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
  <p class="light-paragraph"><strong>Light</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
  <p class="thin-paragraph"><strong>Thin</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>

  <blockquote>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
  </blockquote>

  <blockquote class="text-right">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
  </blockquote>

  <dl>
    <dt>Description lists</dt>
    <dd>A description list is perfect for defining terms.</dd>
    <dt>Euismod</dt>
    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
    <dt>Malesuada porta</dt>
    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
  </dl>

  <dl class="horizontal">
    <dt>Description lists</dt>
    <dd>A description list is perfect for defining terms.</dd>
    <dt>Euismod</dt>
    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
    <dt>Malesuada porta</dt>
    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
  </dl>

  <p>
    Some links: <a href="#/">Login Page</a> and <a href="#/buttons">Buttons</a>.
  </p>

  <p>
    Text with <i style="font-size: 2em">games</i> icon.
  </p>
</template>

<script>
import { AppFullscreen, Events } from 'quasar'

export default {
  data () {
    let vis = []
    return {
      msg: 'aaa',
      visibilityEvents: vis
    }
  },
  methods: {
    myalert () {
      alert('aaa')
    },
    tapped () {
      alert('tapped')
    },
    writeVisibilityState (state) {
      this.visibilityEvents.push('App became ' + state + '.')
    },
    toggleFullscreen () {
      if (AppFullscreen.isActive()) {
        AppFullscreen.exit()
      }
      else {
        AppFullscreen.request()
      }
    }
  },
  mounted () {
    this.$nextTick( () => {
      Events.on('app:visibility', this.writeVisibilityState)
    })
  },
  destroyed () {
    Events.off('app:visibility', this.writeVisibilityState)
  }
}
</script>
