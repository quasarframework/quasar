<template>
  <div class="q-pa-md q-gutter-sm">
    <q-icon :name="iconName" color="red" size="2rem" @click.native="favorite = !favorite"/>
  </div>
</template>
<script>
export default {
  data: () => ({
    favorite: false
  }),
  computed: {
    iconName () {
      return this.favorite ? 'favorite' : 'favorite_border'
    }
  }
}
</script>
