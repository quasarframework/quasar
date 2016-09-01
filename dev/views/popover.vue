<template>
  <div>
    <div style="height: 300px;">&nbsp;</div>

    <quasar-context-menu v-ref:context>
      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.context)">
          <div class="item-content">
            Label
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
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <br>
    Force to bottom left:
    <quasar-popover v-ref:pop position="bottom left">
      <button slot="target" class="primary">
        <i>more_vert</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.pop)">
          <div class="item-content">
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:pop>
      <button slot="target" style="margin-left: 500px;" class="primary">
        <i>more_vert</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.pop)">
          <div class="item-content">
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:tl>
      <button slot="target" class="primary fixed-top-left" style="top: 50px">
        <i class="rotate-90">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.tl)">
          <div class="item-content">
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:tr>
      <button slot="target" class="primary fixed-top-right">
        <i class="rotate-180">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.tr)">
          <div class="item-content">
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:br>
      <button slot="target" class="primary fixed-bottom-right">
        <i class="rotate-270">trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 20" @click="click($refs.br)">
          <div class="item-content">
            Label
          </div>
        </div>
      </div>
    </quasar-popover>

    <quasar-popover v-ref:bl>
      <button slot="target" class="primary fixed-bottom-left">
        <i>trending_up</i>
      </button>

      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 3" @click="click($refs.bl)">
          <div class="item-content">
            Label
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
