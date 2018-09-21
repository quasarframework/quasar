<template>
  <div>
    <div class="layout-padding" :class="{ 'test-height': testHeight }">
      <q-card class="q-my-md">
        <q-card-section class="row items-center">
          <div class="text-h6">Headings</div>
          <q-space />
          <q-select v-model="testFont" :options="testFonts" hide-underline />
          <q-toggle v-model="testHeight" left-label label="Test line heights" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-for="heading in headings" class="row items-center q-mb-lg" :key="heading.label">
            <div class="col-sm-3 col-12">
              <q-chip color="primary" text-color="white" square>.{{ heading.cls }}</q-chip>
              <q-chip color="secondary" text-color="white" square v-if="heading.equivalent">{{ heading.equivalent }}</q-chip>
            </div>
            <div
              class="col-sm-9 col-12"
              :class="heading.cls"
              :style="{ fontFamily: testHeight ? testFont : null }"
            >
              {{ heading.label }}{{ testText }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-my-md">
        <q-card-section>
          <div class="text-h6">Weights</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-for="weight in weights" class="row items-center q-mb-md" :key="weight">
            <div class="col-sm-3 col-12">
              <q-chip color="primary" text-color="white" square>.text-weight-{{ weight }}</q-chip>
            </div>
            <div class="col-sm-9 col-12 q-mb-none q-pl-md q-pt-sm q-pb-sm">
              <div :class="`text-weight-${weight}`"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-my-md">
        <q-card-section>
          <div class="text-h6">Blockquotes</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <blockquote>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
          </blockquote>

          <blockquote class="text-right">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <small>Someone famous for <cite title="Quasar Framework">Quasar Framework</cite></small>
          </blockquote>
        </q-card-section>
      </q-card>

      <q-card class="q-my-md">
        <q-card-section>
          <div class="text-h6">Definition Lists</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <p class="caption">Vertical</p>

          <dl>
            <dt>Description lists</dt>
            <dd>A description list is perfect for defining terms.</dd>
            <dt>Euismod</dt>
            <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
            <dt>Malesuada porta</dt>
            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
          </dl>

          <p class="caption">Horizontal</p>
          <dl class="horizontal">
            <dt>Description lists</dt>
            <dd>A description list is perfect for defining terms.</dd>
            <dt>Euismod</dt>
            <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
            <dd>Donec id elit non mi porta gravida at eget metus.</dd>
            <dt>Malesuada porta</dt>
            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
          </dl>
        </q-card-section>
      </q-card>

      <q-card class="q-my-md">
        <q-card-section>
          <div class="text-h6">Links</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <p>Links: <a>Some link</a> and <a>Some other link</a>.</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style lang="stylus">
.test-height .test-row
  position relative
  margin-bottom 16px
  &:after
    position absolute
    content ''
    top -8px
    bottom -8px
    left -8px
    right -8px
    background-color transparent
    border 8px solid rgba(255, 0, 0, .6)
</style>

<script>
const fonts = [
  'Roboto', 'Open Sans', '-apple-system', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'
]
export default {
  data () {
    return {
      headings: [
        { label: 'Headline 1', cls: 'text-h1', equivalent: 'h1' },
        { label: 'Headline 2', cls: 'text-h2', equivalent: 'h2' },
        { label: 'Headline 3', cls: 'text-h3', equivalent: 'h3' },
        { label: 'Headline 4', cls: 'text-h4', equivalent: 'h4' },
        { label: 'Headline 5', cls: 'text-h5', equivalent: 'h5' },
        { label: 'Headline 6', cls: 'text-h6', equivalent: 'h6' },
        { label: 'Subtitle 1', cls: 'text-subtitle1' },
        { label: 'Subtitle 2', cls: 'text-subtitle2' },
        { label: 'Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.', cls: 'text-body1' },
        { label: 'Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus dolor saepe inventore, soluta id accusantium voluptas beatae.', cls: 'text-body2' },
        { label: 'Caption text', cls: 'text-caption' },
        { label: 'Overline', cls: 'text-overline' }
      ],
      weights: [
        'thin', 'light', 'regular', 'medium', 'bold', 'bolder'
      ],
      fonts,
      testHeight: false,
      testFont: fonts[0]
    }
  },
  computed: {
    testText () {
      return this.testHeight ? ' [Apjyq]' : ''
    },
    testFonts () {
      return fonts.map(f => ({ label: `Font ${f}`, value: f }))
    }
  }
}
</script>
