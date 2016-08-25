<template>
  <div>
    <div class="layout-padding">
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
    </div>

    <quasar-context-menu v-ref:context>
      <div class="list item-delimiter highlight">
        <div
          class="item item-link"
          v-for="n in 30"
          @click="showToast(), $refs.context.close()"
        >
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
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
