<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Basic Slider. No controls. Just swipe between slides or
        use you mouse to drag slides to left or right.
      </p>
      <quasar-slider class="text-white">
        <div slot="slide" class="bg-primary">
          Slide 1
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
      </quasar-slider>

      <p class="caption">
        Slider with Arrows, Dots and Fullscreen controls.
      </p>
      <quasar-slider arrows dots fullscreen class="text-white">
        <div slot="slide" class="bg-primary">
          <div>Slide 1</div>
          <div v-for="n in 12">Line {{(n+2)}}</div>
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
      </quasar-slider>

      <p class="caption">
        Slider with Centered Content
      </p>
      <quasar-slider arrows dots class="text-white">
        <div slot="slide" class="bg-primary centered">
          Slide 1
        </div>
        <div slot="slide" class="bg-secondary centered">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary centered">
          Slide 3
        </div>
      </quasar-slider>

      <p class="caption">
        Slider with Custom Actions as Controls
      </p>
      <quasar-slider arrows dots actions class="text-white">
        <div slot="slide" class="bg-primary">
          <div v-for="n in 20">Slide {{n}}</div>
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
        <i slot="action">camera_enhance</i>
        <i slot="action">bookmark_border</i>
        <i slot="action">add_shopping_cart</i>
      </quasar-slider>

      <p class="caption">
        Launch Slider on Fullscreen
      </p>
      <button class="primary glossy" @click="$refs.modal.open()">
        Launch
      </button>
      <quasar-modal ref="modal" class="maximized">
        <quasar-slider arrows dots class="text-white full-height">
          <div slot="slide" class="bg-primary centered">
            <h1>Slide 1</h1>
            <button class="dark glossy" @click="$refs.modal.close()">Close Me</button>
          </div>
          <div slot="slide" class="bg-secondary centered">
            <h1>Slide 2</h1>
            <button class="dark glossy" @click="$refs.modal.close()">Close Me</button>
          </div>
          <div slot="slide" class="bg-tertiary centered">
            <h1>Slide 3</h1>
            <button class="dark glossy" @click="$refs.modal.close()">Close Me</button>
          </div>
        </quasar-slider>
      </quasar-modal>
    </div>
  </div>
</template>
