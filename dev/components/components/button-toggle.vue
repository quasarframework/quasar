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

                <q-btn-toggle v-model="model" toggle-color="primary" color="amber" text-color="red"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', value: 'two'},
                    {label: 'Three', value: 'three'}
                  ]"
                  @input="value => log('@input', value)"
                  @change="value => log('@change', value)"
                />

                <q-btn toggle-color="primary" color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  label="test"
                />
                <q-btn round toggle-color="primary" color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :size="size"
                  icon="android"
                />

                <q-btn-toggle v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  disable
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', value: 'two'},
                    {label: 'Three', value: 'three'}
                  ]"
                />

                <q-btn-toggle :value="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', icon: 'filter_1', value: 'one'},
                    {label: 'Two', icon: 'filter_2', value: 'two'},
                    {label: 'Three', icon: 'filter_3', value: 'three'}
                  ]"
                  @input="value => log('@input', value)"
                  @change="value => { model = value; log('@change', value) }"
                />

                <q-btn-toggle v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {icon: 'filter_1', value: 'one'},
                    {icon: 'filter_2', value: 'two'},
                    {icon: 'filter_3', value: 'three'}
                  ]"
                />

                <q-btn-toggle v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One', iconRight: 'filter_1', value: 'one'},
                    {label: 'Two', iconRight: 'filter_2', value: 'two'},
                    {label: 'Three', iconRight: 'filter_3', value: 'three'}
                  ]"
                />

                <!-- Pizza all dressed version to test all options. Empty colors are on purpose to test defaults -->
                <q-btn-toggle v-model="model" toggle-color="primary"
                  :push="push" :flat="flat" :outline="outline" :glossy="glossy" :rounded="rounded" :size="size"
                  :options="[
                    {label: 'One',
                      color: 'green',
                      textColor: '',
                      toggleColor: 'blue',
                      textToggleColor: 'yellow',
                      icon: 'filter_1',
                      iconRight: 'explore',
                      value: 'one'},
                    {label: 'Two',
                      color: 'yellow',
                      textColor: 'purple',
                      toggleColor: 'teal',
                      textToggleColor: '',
                      icon: 'filter_2',
                      iconRight: 'event',
                      value: 'two'},
                    {label: 'Three',
                      color: '',
                      textColor: 'red',
                      toggleColor: 'red',
                      textToggleColor: 'blue',
                      icon: 'filter_3',
                      iconRight: 'eject',
                      value: 'three'}
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
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    }
  }
}
</script>

<style lang="stylus">
.button-toggle-group-test .q-btn-toggle
  margin 15px
</style>
