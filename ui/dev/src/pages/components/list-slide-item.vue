<template>
  <div class="q-layout-padding q-mx-auto" style="max-width: 600px">
    <h1>Pan the items below</h1>

    <q-list bordered separator>
      <q-slide-item @left="onLeft" @right="onRight" @click.native="onClickItem">
        <q-icon slot="left" name="done" />
        <q-icon slot="right" name="alarm" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Icons only</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight" @click.native="onClickItem">
        <q-icon slot="left" name="done" />
        <q-icon slot="right" name="alarm" />

        <q-item to="/">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>QItem with link - Icons only</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <div slot="left">
          Left
        </div>
        <div slot="right">
          Right content.. long
        </div>

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Text only</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <div slot="left" class="row items-center">
          <q-icon left name="done" /> Left
        </div>
        <div slot="right" class="row items-center">
          Right content.. long <q-icon right name="alarm" />
        </div>

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Text and icons</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight" left-color="red" right-color="purple">
        <div slot="left" class="row items-center">
          <q-icon left name="done" /> Left
        </div>
        <div slot="right" class="row items-center">
          Right content.. long <q-icon right name="alarm" />
        </div>

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Custom colors (red, purple)</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight" left-color="amber" right-color="primary">
        <div slot="left" class="row items-center text-black">
          <q-icon left name="done" /> Left
        </div>
        <div slot="right" class="row items-center">
          Right content.. long <q-icon right name="alarm" />
        </div>

        <q-item class="bg-black text-white">
          <q-item-section avatar>
            <q-avatar color="grey-9" text-color="grey-4" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Custom colors 2</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-icon slot="left" name="arrow_right" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Only left action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-icon slot="right" name="arrow_left" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Only right action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>No actions</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-icon slot="left" name="arrow_right" />
        <q-icon slot="right" name="arrow_left" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Slide left/right</q-item-label>
            <q-btn label="test btn" @click="onClick" />
          </q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-icon slot="left" name="alarm" />
        <q-icon slot="right" name="alarm" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Slide left/right</q-item-label>
            <q-btn to="/" label="test btn" @click="onClick" />
          </q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @top="onTop" @bottom="onBottom">
        <q-icon slot="top" name="alarm" />
        <q-icon slot="bottom" name="alarm" />

        <q-item style="height: 200px; width: 200px;">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Vertical only</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight" @top="onTop" @bottom="onBottom">
        <q-icon slot="left" name="alarm" />
        <q-icon slot="right" name="alarm" />
        <q-icon slot="top" name="alarm" />
        <q-icon slot="bottom" name="alarm" />

        <q-item style="height: 200px; width: 200px;">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Four actions</q-item-section>
        </q-item>
      </q-slide-item>

      <q-separator />

      <div class="row">
        <div class="col-4">
          <q-slide-item @top="onTop" @bottom="onBottom">
            <q-icon slot="top" name="link" />
            <q-icon slot="bottom" name="link_off" />

            <q-item style="height: 200px; width: 200px;">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="dialpad" />
              </q-item-section>
              <q-item-section>Vertical Slide A</q-item-section>
            </q-item>
          </q-slide-item>
        </div>

        <div class="col-4">
          <q-slide-item @top="onTop" @bottom="onBottom">
            <q-icon slot="top" name="link" />
            <q-icon slot="bottom" name="link_off" />

            <q-item style="height: 200px; width: 200px;">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="face" />
              </q-item-section>
              <q-item-section>Vertical Slide B</q-item-section>
            </q-item>
          </q-slide-item>
        </div>

        <div class="col-4">
          <q-slide-item @top="onTop" @bottom="onBottom">
            <q-icon slot="top" name="link" />
            <q-icon slot="bottom" name="link_off" />

            <q-item style="height: 200px; width: 200px;">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="fingerprint" />
              </q-item-section>
              <q-item-section>Vertical Slide C</q-item-section>
            </q-item>
          </q-slide-item>
        </div>
      </div>
    </q-list>

    <q-separator spaced />

    <div>Dynamic slot</div>
    <q-toggle v-model="slot1Active" label="Left active" />
    <q-toggle v-model="slot2Active" label="Right active" />

    <q-slide-item @left="onLeft" @right="onRight">
      <div v-if="slot1Active" slot="left">
        Left
      </div>
      <div v-if="slot2Active" slot="right">
        Right content.. long
      </div>

      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="bluetooth" />
        </q-item-section>
        <q-item-section>Text only</q-item-section>
      </q-item>
    </q-slide-item>

    <q-slide-item @left="onLeft" @right="onRight">
      <template v-if="slot1Active" v-slot:left>
        <div>
          Left
        </div>
      </template>

      <template v-if="slot2Active" v-slot:right>
        <div>
          Right content.. long
        </div>
      </template>

      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="bluetooth" />
        </q-item-section>
        <q-item-section>Text only</q-item-section>
      </q-item>
    </q-slide-item>

    <q-separator spaced />

    <div>Dynamic slots using @slide event</div>

    <q-slide-item :left-color="leftColor" @left="onLeft" @slide="onSlide">
      <div slot="left" class="row items-center">
        {{ leftMessage }}
      </div>

      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="bluetooth" />
        </q-item-section>
        <q-item-section>Slide towards right</q-item-section>
      </q-item>
    </q-slide-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slot1Active: true,
      slot2Active: false,

      leftSlideRatio: 0
    }
  },

  computed: {
    leftColor () {
      return this.leftSlideRatio >= 1
        ? 'red'
        : 'orange-' + (2 + Math.round(Math.min(6, this.leftSlideRatio * 6)))
    },

    leftMessage () {
      return this.leftSlideRatio >= 1
        ? 'Will perform action'
        : 'Move right to perform action'
    }
  },

  methods: {
    onLeft ({ reset }) {
      console.log('Left action!')
      this.finalize(reset)
    },
    onRight ({ reset }) {
      console.log('Right action!')
      this.finalize(reset)
    },
    onTop ({ reset }) {
      console.log('Top-side action!')
      this.finalize(reset)
    },
    onBottom ({ reset }) {
      console.log('Bottom-side action!')
      this.finalize(reset)
    },
    finalize (reset) {
      console.log('Resetting in 1 second')
      setTimeout(() => {
        reset()
      }, 1000)
    },

    onSlide ({ side, ratio, isReset }) {
      if (side === 'left') {
        setTimeout(() => {
          this.leftSlideRatio = ratio
        }, isReset === true ? 200 : void 0)
      }
    },

    onClickItem () {
      if (this.$q.platform.is.desktop) {
        console.log('clicked on item')
      }
      else {
        this.$q.notify('clicked on item')
      }
    },

    onClick () {
      console.log('clicked on test btn')
    }
  }
}
</script>
