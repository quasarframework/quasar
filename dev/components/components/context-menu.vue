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
        style="height: 300px; margin-top: 40px;"
        class="bg-secondary text-white row flex-center"
      >
        Target area

        <q-context-menu ref="context">
          <q-list link separator no-border style="min-width: 150px; max-height: 300px;">
            <q-item
              v-for="n in 10"
              :key="n"
              @click="showNotify(), $refs.context.hide()"
            >
              <q-item-main label="Label" sublabel="Value" />
            </q-item>
          </q-list>
        </q-context-menu>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QContextMenu,
  QList,
  QItem,
  QItemMain
} from 'quasar'

export default {
  components: {
    QContextMenu,
    QList,
    QItem,
    QItemMain
  },
  methods: {
    showNotify () {
      this.$q.notify((this.$q.platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a context menu item.')
    }
  }
}
</script>
