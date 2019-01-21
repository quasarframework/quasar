<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card flat bordered class="bg-blue-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by Kurt Wagner</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover>
                <q-list>
                  <q-item clickable v-close-menu>
                    <q-item-section>Remove Card</q-item-section>
                  </q-item>
                  <q-item clickable v-close-menu>
                    <q-item-section>Send Feedback</q-item-section>
                  </q-item>
                  <q-item clickable v-close-menu>
                    <q-item-section>Share</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-list>
        <q-expansion-item expand-separator icon="explore" label="First">
          <div class="q-pa-md">
            Lorem ipsum dolor sit amet...
          </div>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="perm_identity" label="Second">
          <div class="q-pa-md">
            Lorem ipsum dolor sit amet...
          </div>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="shopping_cart" label="Third">
          <div class="q-pa-md">
            Lorem ipsum dolor sit amet...
          </div>
        </q-expansion-item>
      </q-list>
    </q-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tab: 'one',
      stars: 3
    }
  }
}
</script>
