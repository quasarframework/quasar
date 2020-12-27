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

    .q-pa-md.relative-position
      doc-code(lang="html") {{ menuExport }}

</template>

<script>
export default {
  data () {
    return {
      fit: false,
      cover: false,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      selfOrigin: { vertical: 'top', horizontal: 'left' },
      exportDialog: false
    }
  },

  computed: {
    anchor () {
      return `${this.anchorOrigin.vertical} ${this.anchorOrigin.horizontal}`
    },

    self () {
      return `${this.selfOrigin.vertical} ${this.selfOrigin.horizontal}`
    },

    menuExport () {
      const props = this.cover === true
        ? `cover anchor="${this.anchor}"`
        : `${this.fit ? 'fit ' : ''}anchor="${this.anchor}" self="${this.self}"`

      return `<q-menu ${props}>
  <q-item clickable>
    <q-item-section>New tab</q-item-section>
  </q-item>
  <q-item clickable>
    <q-item-section>New incognito tab</q-item-section>
  </q-item>
</q-menu>`
    }
  }
}
</script>
