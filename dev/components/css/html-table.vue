<template>
  <div>
    <div class="layout-padding">
      <div class="column group">
        <label>
          <q-checkbox v-model="bordered"></q-checkbox>
          Bordered
        </label>
        <label>
          <q-checkbox v-model="highlight"></q-checkbox>
          Highlight
        </label>

        <div class="column gt-md-row">
          <label>
            <q-radio v-model="delimiter" val="none"></q-radio>
            No delimiter
          </label>
          <label>
            <q-radio v-model="delimiter" val="horizontal"></q-radio>
            Horizontal delimiter
          </label>
          <label>
            <q-radio v-model="delimiter" val="vertical"></q-radio>
            Vertical delimiter
          </label>
          <label>
            <q-radio v-model="delimiter" val="cell"></q-radio>
            Cell delimiter
          </label>
        </div>

        <div class="column gt-md-row">
          <label>
            <q-radio v-model="stripe" val="none"></q-radio>
            No Stripe
          </label>
          <label>
            <q-radio v-model="stripe" val="odd"></q-radio>
            Striped Odd
          </label>
          <label>
            <q-radio v-model="stripe" val="even"></q-radio>
            Striped Even
          </label>
        </div>

        <div>
          <label>
            <q-radio v-model="type" val="none"></q-radio>
            Normal
          </label>
          <label>
            <q-radio v-model="type" val="flipped"></q-radio>
            Flipped
          </label>
          <label>
            <q-radio v-model="type" val="responsive"></q-radio>
            Responsive
          </label>
        </div>

        <div>
          <label>
            <q-radio v-model="gutter" val="none"></q-radio>
            Normal
          </label>
          <label>
            <q-radio v-model="gutter" val="compact"></q-radio>
            Compact
          </label>
          <label>
            <q-radio v-model="gutter" val="loose"></q-radio>
            Loose
          </label>
        </div>
      </div>

      <br>
      <div class="label bg-secondary text-white">
        Classes <span class="right-detail"><em>{{computedClasses}}</em></span>
      </div>

      <table style="margin-top: 30px;" class="q-table" :class="computedClasses">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-right">Price</th>
            <th class="text-right">In Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td data-th="Name" class="text-left">Item #1</td>
            <td data-th="Price" class="text-right">$10.11</td>
            <td data-th="In Stock" class="text-right">101</td>
          </tr>
          <tr>
            <td data-th="Name" class="text-left">Item #2</td>
            <td data-th="Price" class="text-right">$8.88</td>
            <td data-th="In Stock" class="text-right">34</td>
          </tr>
          <tr>
            <td data-th="Name" class="text-left">Item #3</td>
            <td data-th="Price" class="text-right">$0.15</td>
            <td data-th="In Stock" class="text-right">1670</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      styles: [
        '',
        'bordered',
        'horizontal-delimiter',
        'vertical-delimiter',
        'cell-delimiter',
        'striped-odd',
        'striped-even',
        'highlight',
        'compact',
        'loose',
        'flipped'
      ],
      bordered: false,
      highlight: false,
      delimiter: 'none',
      stripe: 'none',
      type: 'none',
      gutter: 'none'
    }
  },
  computed: {
    computedClasses () {
      let classes = []

      if (this.bordered) {
        classes.push('bordered')
      }
      if (this.highlight) {
        classes.push('highlight')
      }
      if (this.delimiter !== 'none') {
        classes.push(this.delimiter + '-delimiter')
      }
      if (this.stripe !== 'none') {
        classes.push('striped-' + this.stripe)
      }
      if (this.type !== 'none') {
        classes.push(this.type)
      }
      if (this.gutter !== 'none') {
        classes.push(this.gutter)
      }

      return classes
    }
  }
}
</script>
