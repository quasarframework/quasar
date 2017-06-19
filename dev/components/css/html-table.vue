<template>
  <div class="layout-padding">
    <div class="column group">
      <q-checkbox v-model="bordered" label="Bordered" />
      <q-checkbox v-model="highlight" label="Highlight" />

      <div class="column gt-md-row">
        <q-radio v-model="separator" val="none" label="No separator" />
        <q-radio v-model="separator" val="horizontal" label="Horizontal separator" />
        <q-radio v-model="separator" val="vertical" label="Vertical separator" />
        <q-radio v-model="separator" val="cell" label="Cell separator" />
      </div>

      <div class="column gt-md-row">
        <q-radio v-model="stripe" val="none" label="No Stripe" />
        <q-radio v-model="stripe" val="odd" label="Striped Odd" />
        <q-radio v-model="stripe" val="even" label="Striped Even" />
      </div>

      <div>
        <q-radio v-model="type" val="none" label="Normal" />
        <q-radio v-model="type" val="flipped" label="Flipped" />
        <q-radio v-model="type" val="responsive" label="Responsive" />
      </div>

      <div>
        <q-radio v-model="gutter" val="none" label="Normal" />
        <q-radio v-model="gutter" val="compact" label="Compact" />
        <q-radio v-model="gutter" val="loose" label="Loose" />
      </div>
    </div>

    <br>
    <q-chip color="secondary">
      Classes <em>{{computedClasses}}</em>
    </q-chip>

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
</template>

<script>
export default {
  data () {
    return {
      styles: [
        '',
        'bordered',
        'horizontal-separator',
        'vertical-separator',
        'cell-separator',
        'striped-odd',
        'striped-even',
        'highlight',
        'compact',
        'loose',
        'flipped'
      ],
      bordered: false,
      highlight: false,
      separator: 'none',
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
      if (this.separator !== 'none') {
        classes.push(this.separator + '-separator')
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
