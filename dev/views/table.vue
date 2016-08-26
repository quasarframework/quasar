<template>
  <div class="layout-padding">
    <div v-for="style in styles" style="margin-bottom: 30px">
      <h3>Class: '{{style}}'</h3>
      <table :class="style" class="quasar-table">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-right">Price</th>
            <th class="text-right">In Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="text-left">Item #1</td>
            <td class="text-right">$10.11</td>
            <td class="text-right">101</td>
          </tr>
          <tr>
            <td class="text-left">Item #2</td>
            <td class="text-right">$8.88</td>
            <td class="text-right">34</td>
          </tr>
          <tr>
            <td class="text-left">Item #3</td>
            <td class="text-right">$0.15</td>
            <td class="text-right">1670</td>
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
        'row-delimiter',
        'cell-delimiter',
        'striped',
        'highlight',
        'compact'
      ]
    }
  }
}
</script>
