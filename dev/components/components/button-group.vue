<template>
  <div class="layout-padding button-group-test">
    <div v-for="push in options" :key="push">
      <div v-for="flat in options" :key="flat" v-if="!push || !flat">
        <div v-for="outline in options" :key="outline" v-if="!(push || flat) || !outline">
          <div v-for="rounded in options" :key="rounded">
            <div v-for="size in sizes" :key="size" class="q-ma-sm">
              <p class="caption">
                {{push ? 'push ' : ''}}
                {{rounded ? 'rounded ' : ''}}
                {{outline ? 'outline ' : ''}}
                {{flat ? 'flat ' : ''}}
                {{size}}
              </p>
              <q-btn-group :push="push" :rounded="rounded" :outline="outline" :flat="flat">
                <q-btn color="yellow" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                  First
                </q-btn>
                <q-btn color="amber" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                  Second
                </q-btn>
                <q-btn color="orange" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                  Third
                </q-btn>
              </q-btn-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.button-group-test
  .q-btn-group
    margin 5px 15px
</style>

<script>
export default {
  data () {
    return {
      options: [true, false],
      sizes: ['sm', 'md', 'lg']
    }
  }
}
</script>
