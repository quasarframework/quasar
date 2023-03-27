<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar>
      <q-btn dense flat :icon="fabApple" />
      <div class="text-weight-bold">
        App
      </div>
      <div class="cursor-pointer gt-md">File</div>
      <div class="cursor-pointer gt-md">Edit</div>
      <div class="cursor-pointer gt-md">View</div>
      <div class="cursor-pointer gt-md">Window</div>
      <div class="cursor-pointer gt-md">Help</div>
      <q-space />
      <q-btn dense flat icon="airplay" class="gt-xs" />
      <q-btn dense flat icon="battery_charging_full" />
      <q-btn dense flat icon="wifi" />
      <div>9:41</div>
      <q-btn dense flat icon="search" />
      <q-btn dense flat icon="list" />
    </q-bar>

    <q-bar class="bg-black text-white">
      <q-btn dense flat :icon="fabApple" />
      <div class="text-weight-bold">
        App
      </div>
      <div class="cursor-pointer gt-md">File</div>
      <div class="cursor-pointer gt-md">Edit</div>
      <div class="cursor-pointer gt-md">View</div>
      <div class="cursor-pointer gt-md">Window</div>
      <div class="cursor-pointer gt-md">Help</div>
      <q-space />
      <q-btn dense flat icon="airplay" class="gt-xs" />
      <q-btn dense flat icon="battery_charging_full" />
      <q-btn dense flat icon="wifi" />
      <div>9:41</div>
      <q-btn dense flat icon="search" />
      <q-btn dense flat icon="list" />
    </q-bar>

    <q-bar>
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-center text-weight-bold">
        My-App
      </div>
    </q-bar>

    <q-bar dark class="bg-primary text-white">
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-center text-weight-bold">
        My-App
      </div>
    </q-bar>
  </div>
</template>

<script>
import { fabApple } from '@quasar/extras/fontawesome-v6'

export default {
  setup () {
    return { fabApple }
  }
}
</script>
