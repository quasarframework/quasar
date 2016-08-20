<template>
  <div>
    <div style="height: 300px;">&nbsp;</div>

    <quasar-context-menu v-ref:context>
      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.context)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-context-menu>

    <quasar-popover touch-position v-ref:popover1>
      <button slot="target" class="primary">
        <i>more_vert</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.popover1)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:tl class="fixed-top-left" style="top: 50px">
      <button slot="target" class="primary">
        <i class="rotate-90">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.tl)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:tr class="fixed-top-right">
      <button slot="target" class="primary">
        <i class="rotate-180">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.tr)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:br class="fixed-bottom-right">
      <button slot="target" class="primary">
        <i class="rotate-270">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.br)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:bl class="fixed-bottom-left">
      <button slot="target" class="primary">
        <i>trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 3" @click="click($refs.bl)">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-popover>

    <div style="height: 1500px;">&nbsp;</div>
  </div>
</template>

<script>
import { Toast } from 'quasar'

export default {
  methods: {
    click (target) {
      Toast.create('clicked')
      if (target) {
        target.close()
      }
    }
  }
}
</script>
