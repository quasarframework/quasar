<template lang="pug">
  q-card(flat, bordered)
    .q-pa-md.text-center
      q-btn(push, color="orange", label="Test me", style="width: 200px")
        q-tooltip(
          :anchor="anchor"
          :self="self"
        ) Here I am!

    q-separator

    q-card-section.row
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

      .column.items-center.col-6
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
      doc-code(lang="html") {{ tooltipExport }}

</template>

<script>
export default {
  data () {
    return {
      fit: false,
      cover: false,
      anchorOrigin: { vertical: 'bottom', horizontal: 'middle' },
      selfOrigin: { vertical: 'top', horizontal: 'middle' },
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

    tooltipExport () {
      return `<q-tooltip anchor="${this.anchor}" self="${this.self}">
  Here I am!
</q-tooltip>`
    }
  }
}
</script>
