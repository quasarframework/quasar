<template lang="pug">
q-card(flat, bordered)
  .q-pa-md.text-center
    q-btn(push, color="orange", label="Test me", style="width: 200px")
      q-menu(
        :fit="fit"
        :cover="cover"
        :anchor="anchor"
        :self="self"
        auto-close
      )
        q-list(style="min-width: 100px")
          q-item(clickable)
            q-item-section New tab
          q-item(clickable)
            q-item-section New incognito tab
          q-separator
          q-item(clickable)
            q-item-section Recent tabs
          q-item(clickable)
            q-item-section History

  q-separator

  .q-pt-sm
    .flex.flex-center.q-gutter-md
      q-toggle(v-model="fit", label="Fit")
      q-toggle(v-model="cover", label="Cover")

  q-card-section.row(:class="cover ? 'justify-center' : ''")
    .column.items-center.col-6
      .text-weight-bold Anchor Origin
      .flex.q-gutter-sm
        .column.q-gutter-y-xs
          .text-center Vertical
          q-radio(dense, v-model="anchorOrigin.vertical", val="top", label="Top")
          q-radio(dense, v-model="anchorOrigin.vertical", val="center", label="Center")
          q-radio(dense, v-model="anchorOrigin.vertical", val="bottom", label="Bottom")
        .column.q-gutter-y-xs
          .text-center Horizontal
          q-radio(dense, v-model="anchorOrigin.horizontal", val="left", label="Left")
          q-radio(dense, v-model="anchorOrigin.horizontal", val="middle", label="Middle")
          q-radio(dense, v-model="anchorOrigin.horizontal", val="right", label="Right")
          q-radio(dense, v-model="anchorOrigin.horizontal", val="start", label="Start")
          q-radio(dense, v-model="anchorOrigin.horizontal", val="end", label="End")

    .column.items-center.col-6(v-if="!cover")
      .text-weight-bold Self Origin
      .flex.q-gutter-sm
        .column.q-gutter-y-xs
          .text-center Vertical
          q-radio(dense, v-model="selfOrigin.vertical", val="top", label="Top")
          q-radio(dense, v-model="selfOrigin.vertical", val="center", label="Center")
          q-radio(dense, v-model="selfOrigin.vertical", val="bottom", label="Bottom")
        .column.q-gutter-y-xs
          .text-center Horizontal
          q-radio(dense, v-model="selfOrigin.horizontal", val="left", label="Left")
          q-radio(dense, v-model="selfOrigin.horizontal", val="middle", label="Middle")
          q-radio(dense, v-model="selfOrigin.horizontal", val="right", label="Right")
          q-radio(dense, v-model="selfOrigin.horizontal", val="start", label="Start")
          q-radio(dense, v-model="selfOrigin.horizontal", val="end", label="End")

  q-separator

  .q-pa-md.relative-position.bg-grey-2
    doc-code(lang="html", :code="menuExport")

</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'MenuPositioning',

  setup () {
    const fit = ref(false)
    const cover = ref(false)
    const anchorOrigin = reactive({ vertical: 'bottom', horizontal: 'left' })
    const selfOrigin = reactive({ vertical: 'top', horizontal: 'left' })
    const exportDialog = ref(false)

    const anchor = computed(() => `${anchorOrigin.vertical} ${anchorOrigin.horizontal}`)
    const self = computed(() => `${selfOrigin.vertical} ${selfOrigin.horizontal}`)
    const menuExport = computed(() => {
      const props = cover.value === true
        ? `cover anchor="${anchor.value}"`
        : `${fit.value ? 'fit ' : ''}anchor="${anchor.value}" self="${self.value}"`

      return `<q-menu ${props}>
  <q-item clickable>
    <q-item-section>New tab</q-item-section>
  </q-item>
  <q-item clickable>
    <q-item-section>New incognito tab</q-item-section>
  </q-item>
</q-menu>`
    })

    return {
      fit,
      cover,
      anchorOrigin,
      selfOrigin,
      exportDialog,

      anchor,
      self,
      menuExport
    }
  }
}
</script>
