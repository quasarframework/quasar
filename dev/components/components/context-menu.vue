<template>
  <div>
    <div class="layout-padding" style="margin-bottom: 1000px;">
      <p class="caption">
        <span class="desktop-only">
          Right click anywhere on the Page below (not on header though).
          <br>
          On a real mobile device it works different by opening a minimized Modal triggered by a long tap.
        </span>
        <span class="mobile-only">
          Long Tap anywhere on the Page below (not on header though).
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
    </div>

    <quasar-context-menu ref="context">
      <div class="list highlight" style="min-width: 150px; max-height: 300px;">
        <div
          class="item item-link two-lines item-delimiter"
          v-for="n in 10"
          @click="showToast(), $refs.context.close()"
        >
          <div class="item-content">
            <div>Label</div>
            <div>Value</div>
          </div>
        </div>
      </div>
    </quasar-context-menu>
  </div>
</template>

<script>
import { Platform, Toast } from 'quasar'

export default {
  methods: {
    showToast () {
      Toast.create((Platform.is.desktop ? 'Clicked' : 'Tapped') + ' on a context menu item.')
    }
  }
}
</script>
