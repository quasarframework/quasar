<template>
  <div style="max-width: 600px;" class="q-pa-md">
    <div>
      <figure>
        <p>Zoom in/out with mouse. Can also use ESC to cancel zoom.</p>
        <q-zoom
          color="blue-grey-1"
        >
          <img
            src="https://cdn.quasar.dev/img/mountains.jpg"
            alt="QZoom basic"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div>
      <figure>
        <p>This example shows how the background color can be changed if the image doesn't fill the screen.</p>
        <q-zoom
          color="orange-6"
        >
          <img
            src="https://d33wubrfki0l68.cloudfront.net/0ca2cd8674ea552c7555ffa2f48e94334d564106/1ac1a/image-3.a41d7456.jpg"
            alt="QZoom with background color"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>Example of a potrait image.</p>
      <p class="placeholder">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <figure style="float: left; width: 30%">
        <q-zoom
          color="black"
        >
          <img
            src="https://d33wubrfki0l68.cloudfront.net/28e392e11daadef180e12e890014c81dec12bd0c/3738d/image-4.a4d08f7d.jpg"
            alt="QZoom with portrait image"
            class="my-image-portrait"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
      <p class="placeholder">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      </p>
      <p class="placeholder">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
    <q-separator />
    <div>
      <figure>
        <p>Example using video.</p>
        <q-zoom
          background-color="blue-grey-1"
        >
          <video class="my-image" poster="https://cdn.quasar.dev/img/polina.jpg" autoplay loop muted>
            <source type="video/webm" src="https://cdn.quasar.dev/img/polina.webm">
            <source type="video/mp4" src="https://cdn.quasar.dev/img/polina.mp4">
          </video>
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>Example using content.</p>
      <q-zoom
        color="grey-3"
      >
        <div>
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p class="placeholder">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </q-zoom>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>Normally, when content is Zoomed with QZoom, the scrollbars are turned off. If you turn on the restore-on-scroll property, the scrollbars (if any) will not be hidden. As well, when a scroll event takes place, if zoomed, the content will automatically be restored.</p>
      <figure>
        <q-zoom
          color="blue-grey-1"
          restore-on-scroll
        >
          <img
            src="https://cdn.quasar.dev/img/parallax2.jpg"
            alt="QZoom with restore on scroll"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>When the scale property is turned on you can use the mouse wheel to zoom in and out of the content. Typically you would only want to use this with images.</p>
      <figure>
        <q-zoom
          color="blue-grey-1"
          scale
        >
          <img
            src="https://cdn.quasar.dev/img/mountains.jpg"
            alt="QZoom with scale"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>You can use the property initial-scale when scale is true, to set the scaling for the content. This is a number and needs to be between 0.05 and 10.</p>
      <figure>
        <q-zoom
          color="blue-grey-1"
          scale
          initial-scale="5"
        >
          <img
            src="https://cdn.quasar.dev/img/mountains.jpg"
            alt="QZoom with initial scale"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>If you use the property no-wheel-scale with the above example, you can restrict the ability for the user to scale.</p>
      <figure>
        <q-zoom
          color="blue-grey-1"
          scale
          initial-scale="5"
          no-wheel-scale
        >
          <img
            src="https://cdn.quasar.dev/img/mountains.jpg"
            alt="QZoom with scale"
            class="my-image"
          >
        </q-zoom>
        <figcaption>This is the "figcaption"</figcaption>
      </figure>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>If your content is text-based in nature, you can provide the scale-text property. Using the mouse wheel will increase/decrease the font size.</p>
      <q-zoom
        color="white"
        scale-text
      >
        <div class="q-pa-sm">
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p class="placeholder">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </q-zoom>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>You can use the property initial-scale-text when scale-text is true, to set the scaling for text. This is a percentage and needs to be between 50 and 500.</p>
      <q-zoom
        color="white"
        scale-text
        initial-scale-text="200"
      >
        <div class="q-pa-sm">
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p class="placeholder">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </q-zoom>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>If you use the property no-wheel-scale, you can restrict the ability for the user to scale the text.</p>
      <q-zoom
        color="white"
        scale-text
        initial-scale-text="200"
        no-wheel-scale
      >
        <div class="q-pa-sm">
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p class="placeholder">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p class="placeholder">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </q-zoom>
    </div>
    <q-separator />
    <div style="padding-left: 40px;">
      <p>When the property manual is set, then the automatic nature of QZoom is gone and everything must be done programmatically. However, you can still use the ESC key to restore the content.</p>
      <q-btn
        color="primary"
        label="Zoom"
        flat
        @click="menuClicked"
      />
      <q-zoom
        ref="zoom"
        manual
        no-center
        scale-text
        color="blue-grey-1"
        style="height: 600px; width: 100%"
      >
        <div class="fit">
          <q-layout view="lhh LpR lff" container style="height: 100%" class="shadow-2 rounded-borders">
            <q-header reveal class="bg-black">
              <q-toolbar>
                <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
                <q-toolbar-title>Header</q-toolbar-title>
                <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
              </q-toolbar>
            </q-header>
            <q-footer>
              <q-toolbar>
                <q-toolbar-title>Footer</q-toolbar-title>
              </q-toolbar>
            </q-footer>
            <q-drawer
              v-model="drawerLeft"
              :width="350"
              :breakpoint="700"
              bordered
              content-class="bg-grey-3"
            >
              <q-scroll-area class="fit">
                <div class="q-pa-sm">
                  <div v-for="n in 50" :key="n">Text {{ n }} / 50</div>
                </div>
              </q-scroll-area>
            </q-drawer>

            <q-drawer
              side="right"
              v-model="drawerRight"
              bordered
              :width="350"
              :breakpoint="500"
              content-class="bg-grey-3"
            >
              <q-scroll-area class="fit">
                <div class="q-pa-sm">
                  <div v-for="n in 50" :key="n">Text {{ n }} / 50</div>
                </div>
              </q-scroll-area>
            </q-drawer>
            <q-page-container>
              <q-page style="padding-top: 60px" class="q-pa-md">
                <p>Some information about <strong>QZoom</strong>:<br>
                1. You can Zoom anything from images to video or any content<br>
                2. Perfect for accessible sites<br>
                3. Great for creating blogs/articles with image call-outs</p>
                <p>To restore this page, press the ESC button</p>
                <p>Hint: When zoomed, use the mouse wheel to increase/decrease the font size.</p>
                <q-page-sticky position="top" expand class="bg-accent text-white">
                  <q-toolbar>
                    <q-btn flat round dense icon="map" />
                    <q-toolbar-title>Title</q-toolbar-title>
                  </q-toolbar>
                </q-page-sticky>
              </q-page>
              <q-page-scroller position="bottom">
                <q-btn fab icon="keyboard_arrow_up" color="red" />
              </q-page-scroller>
            </q-page-container>
          </q-layout>
        </div>
      </q-zoom>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawerLeft: false,
      drawerRight: false
    }
  },
  methods: {
    menuClicked () {
      this.$refs.zoom.zoom()
    }
  }
}
</script>

<style scoped lang="sass">
.my-image
  width: 100%
  height: auto
  max-width: 100%
  max-height: 100%
  margin: auto

.my-image-portrait
  width: auto
  height: auto
  max-width: 100%
  max-height: 100%
  margin: auto

.placeholder
  font-family: sans-serif
  margin: 24px auto
  pointer-events: none
  text-align: justify
  user-select: none

</style>
