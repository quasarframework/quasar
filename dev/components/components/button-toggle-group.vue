<template>
  <div class="layout-padding button-toggle-group-test">
    <p class="caption">
      <span>Model: </span>
      <strong>{{ model }}</strong>
    </p>

    <div v-for="push in options" :key="push">
      <div v-for="flat in options" :key="flat" v-if="!push || !flat">
        <div v-for="outline in options" :key="outline" v-if="!(push || flat) || !outline">
          <div v-for="glossy in options" :key="glossy" v-if="!(push || flat) || !outline">
            <div v-for="rounded in options" :key="rounded">
              <div v-for="size in sizes" :key="size" class="q-ma-sm">
                <p class="caption">
                  {{push ? 'push ' : ''}}
                  {{rounded ? 'rounded ' : ''}}
                  {{outline ? 'outline ' : ''}}
                  {{flat ? 'flat ' : ''}}
                  {{glossy ? 'glossy ' : ''}}
                  {{size}}
                </p>

                <q-btn-toggle-group v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', value: 'two'},
                    {label: 'Three', value: 'three'}
                  ]"
                />

                <q-btn-toggle-group v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', icon: 'filter_1', value: 'one'},
                    {label: 'Two', icon: 'filter_2', value: 'two'},
                    {label: 'Three', icon: 'filter_3', value: 'three'}
                  ]"
                />

                <q-btn-toggle-group v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {icon: 'filter_1', value: 'one'},
                    {icon: 'filter_2', value: 'two'},
                    {icon: 'filter_3', value: 'three'}
                  ]"
                />

                <q-btn-toggle-group v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', iconRight: 'filter_1', value: 'one'},
                    {label: 'Two', iconRight: 'filter_2', value: 'two'},
                    {label: 'Three', iconRight: 'filter_3', value: 'three'}
                  ]"
                />

                <q-btn-toggle-group v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', toggleColor: 'yellow', value: 'two'},
                    {label: 'Three', toggleColor: 'red', value: 'three'}
                  ]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '',
      options: [true, false],
      sizes: ['sm', 'md', 'lg']
    }
  }
}
</script>

<style lang="stylus">
.button-toggle-group-test .q-btn-toggle-group
  margin 15px
</style>
