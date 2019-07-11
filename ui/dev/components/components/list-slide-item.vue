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
        <q-icon slot="left" name="done" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>Only left action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-icon slot="right" name="alarm" />

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
        <q-icon slot="left" name="alarm" />
        <q-icon slot="right" name="alarm" />

        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="bluetooth" />
          </q-item-section>
          <q-item-section>
            <q-item-label>No actions</q-item-label>
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
            <q-item-label>No actions</q-item-label>
            <q-btn to="/" label="test btn" @click="onClick" />
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
</template>

<script>
export default {
  methods: {
    onLeft ({ reset }) {
      console.log('Left action!')
      this.finalize(reset)
    },
    onRight ({ reset }) {
      console.log('Right action!')
      this.finalize(reset)
    },
    finalize (reset) {
      console.log('Resetting in 1 second')
      setTimeout(() => {
        reset()
      }, 1000)
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
