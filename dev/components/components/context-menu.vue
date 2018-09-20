<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">
          Right click on the colored area below.
          <br>
          On a real mobile device it works different by opening a minimized Modal triggered by a long tap.
        </span>
        <span class="mobile-only">
          Long Tap on the colored area below (not on header though).
          <br>
          On a desktop it works different by opening a Popover.
        </span>
      </p>
      <blockquote>
        <small>
          Works with any elements you want. It doesn't have to be a List.
        </small>
      </blockquote>
      <p class="caption">
        <span class="mobile-only">
          On a desktop browser user
        </span>
        <span class="desktop-only">
          User
        </span>
        can dismiss the Context Menu
        by hitting the &lt;ESCAPE&gt; key.
      </p>

      <div
        style="height: 600px; margin-top: 40px;"
        class="bg-secondary text-white row items-stretch"
      >
        <div class="col-6 flex flex-center" v-for="n in 4" :key="n" >
          Target area {{ n }}
        </div>

        <q-context-menu @show="onShow" @hide="onHide">
          <q-list link separator no-border style="min-width: 150px; max-height: 300px;">
            <q-item
              v-for="n in 10"
              :key="n"
              v-close-overlay
              @click.native="showNotify()"
            >
              <q-item-main label="Label" sublabel="Value" />
            </q-item>
          </q-list>
        </q-context-menu>
      </div>
      <p class="caption">Visible: {{ visible }}</p>
      <pre v-if="event && event.target">{{ event.target.innerText }}</pre>

      <div class="block-1 q-ma-md">
        <q-context-menu>
          <q-list link separator style="min-width: 150px;">
            <q-item v-close-overlay><q-item-main label="Foo"/></q-item>
            <q-item v-close-overlay><q-item-main label="Bar"/></q-item>
          </q-list>
        </q-context-menu>
      </div>

      <div class="block-2 q-ma-md">
        <q-context-menu>
          <q-list link separator style="min-width: 150px;">
            <q-item v-close-overlay><q-item-main label="Foo"/></q-item>
            <q-item v-close-overlay><q-item-main label="Bar"/></q-item>
          </q-list>
        </q-context-menu>
      </div>

      <div class="block-3 q-ma-md">
        <q-context-menu>
          <q-list link separator style="min-width: 150px;">
            <q-item v-close-overlay><q-item-main label="Foo"/></q-item>
            <q-item v-close-overlay><q-item-main label="Bar"/></q-item>
          </q-list>
        </q-context-menu>
      </div>

      <div class="block-4 q-ma-md">
        <q-context-menu>
          <q-list link separator style="min-width: 150px;">
            <q-item v-close-overlay><q-item-main label="Foo"/></q-item>
            <q-item v-close-overlay><q-item-main label="Bar"/></q-item>
          </q-list>
        </q-context-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      event: null,
      visible: false
    }
  },
  methods: {
    showNotify () {
      this.$q.notify((this.$q.platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a context menu item.')
    },
    onShow (showEv) {
      console.log('Show event:', showEv)
      this.event = showEv
      this.visible = true
    },
    onHide (showEv, hideEv) {
      console.log('Hide event:', hideEv)
      this.event = showEv
      this.visible = false
    }
  }
}
</script>

<style lang="stylus">
.block-1, .block-2, .block-3, .block-4 {
  display: inline-block;
  width: 150px;
  height: 150px;
}

.block-1 {
  background: red;
}

.block-2 {
  background: yellow;
}

.block-3 {
  background: blue;
}

.block-4 {
  background: pink;
}
</style>
