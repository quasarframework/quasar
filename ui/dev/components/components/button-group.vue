<template>
  <div class="q-layout-padding button-group-test">
    <q-btn-group push glossy>
      <q-btn color="yellow" push to="/a">
        Link /a
      </q-btn>
      <q-btn color="amber" push to="/b">
        Link /b
      </q-btn>
      <q-btn color="orange" push to="/c">
        Link /c
      </q-btn>
    </q-btn-group>

    <q-btn-group unelevated>
      <q-btn color="yellow" unelevated to="/a">
        Link /a
      </q-btn>
      <q-btn color="amber" unelevated to="/b">
        Link /b
      </q-btn>
      <q-btn color="orange" unelevated to="/c">
        Link /c
      </q-btn>
    </q-btn-group>

    <q-btn-group rounded spread>
      <q-btn rounded color="primary" label="One" />

      <q-btn rounded color="primary" label="Two" />

      <q-btn-dropdown auto-close rounded color="primary" label="Three" split>
        <!-- dropdown content goes here -->
        <q-list padding style="width: 250px">
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="folder" color="purple" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>
                February 22, 2016
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="folder" color="purple" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Videos</q-item-label>
              <q-item-label caption>
                London
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-separator inset />
          <q-item-label header inset>
            Files
          </q-item-label>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="assignment" color="teal" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>London</q-item-label>
              <q-item-label caption>
                March 1st, 2018
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="assignment" color="teal" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Paris</q-item-label>
              <q-item-label caption>
                January 22nd, 2017
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn-group>

    <q-btn-group spread>
      <q-btn color="yellow">
        Btn 1
      </q-btn>
      <q-btn color="amber">
        Btn 2
      </q-btn>
      <q-btn color="orange">
        Btn 3
      </q-btn>
    </q-btn-group>

    <div v-for="push in options" :key="push">
      <template v-if="!push || !flat">
        <div v-for="flat in options" :key="flat">
          <template v-if="!(push || flat) || !outline">
            <div v-for="outline in options" :key="outline">
              <div v-for="rounded in options" :key="rounded">
                <div v-for="size in sizes" :key="size" class="q-ma-sm">
                  <p class="caption">
                    {{ push ? 'push ' : '' }}
                    {{ rounded ? 'rounded ' : '' }}
                    {{ outline ? 'outline ' : '' }}
                    {{ flat ? 'flat ' : '' }}
                    {{ size }}
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

                  <q-btn-group :push="push" :rounded="rounded" :outline="outline" :flat="flat">
                    <q-btn color="yellow" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size" disable>
                      First
                    </q-btn>
                    <q-btn color="amber" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size" disable>
                      Second
                    </q-btn>
                    <q-btn color="orange" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size" disable>
                      Third
                    </q-btn>
                  </q-btn-group>

                  <q-btn-group :push="push" :rounded="rounded" :outline="outline" style="margin-left: 2em;">
                    <q-btn color="orange" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                      First
                    </q-btn>
                    <q-btn color="orange" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                      Second
                    </q-btn>

                    <q-separator vertical />

                    <q-btn color="orange" :push="push" :rounded="rounded" :outline="outline" :flat="flat" :size="size">
                      Separated
                    </q-btn>
                  </q-btn-group>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="stylus">
.button-group-test
  .q-btn-group
    // margin 5px 15px
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
