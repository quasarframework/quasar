<template>
  <div class="col position-relative whatsapp-container bg-grey-4">
    <q-layout view="lHh Lpr lFf" class="shadow-3" container
      :style="{
        height: (this.$q.screen.height - (this.$q.screen.gt.md ? 40 : 0)) + 'px',
        width: (this.$q.screen.width - (this.$q.screen.gt.md ? 350 : 0)) + 'px',
        top: this.$q.screen.gt.md ? '20px' : 0
      }"
    >
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn round flat>
            <q-avatar>
              <img :src="currentConversation.avatar">
            </q-avatar>
          </q-btn>
          <span class="q-subtitle-1 q-pl-md">
            {{ currentConversation.person }}
          </span>
          <q-space/>
          <q-btn round flat icon="search"/>
          <q-btn round flat icon="attachment" class="rotate-135"/>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Contact data</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Select messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Silence</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Clear messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Erase messages</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        bordered :breakpoint="0"
        :width="350"
      >
        <q-toolbar class="bg-grey-3">
          <q-avatar class="cursor-pointer">
            <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />
          </q-avatar>
          <q-space />
          <q-btn round flat icon="message" />
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>New group</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Archived</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Favorites</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>

        <q-toolbar class="bg-grey-2">
          <q-input rounded outlined dense class="full-width" bg-color="white" v-model="search" placeholder="Search or start a new conversation">
            <template slot="prepend">
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item v-for="(conversation, index) in conversations" :key="conversation.id" clickable ripple @click="currentConversationIndex = index">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="conversation.avatar">
                </q-avatar>{{          }}
              </q-item-section>{{  }}
              <q-item-section>
                <div class="row justify-between items-center">
                  <q-item-label>
                    {{ conversation.person }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ conversation.time }}
                  </q-item-label>
                </div>
                <div class="row justify-between items-center">
                  <q-item-label class="conversation__summary" caption>
                    <q-icon name="check" v-if="conversation.sent"/>
                    <q-icon name="fas fa-ban" v-if="conversation.deleted"/>
                    {{ conversation.caption }}
                  </q-item-label>
                  <q-item-label class="conversation__more" caption>
                    <q-icon name="keyboard_arrow_down"/>
                  </q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-footer>
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon"/>
          <q-input rounded outlined dense class="col-grow" bg-color="white" v-model="message" placeholder="Type a message"/>
          <q-btn round flat icon="mic"/>
        </q-toolbar>
      </q-footer>

      <q-page-container class="bg-grey-2">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: true,
      search: '',
      message: '',
      currentConversationIndex: 0,
      conversations: [
        {
          id: 1,
          person: 'Razvan Stoenescu',
          avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
          caption: 'I\'m working on Quasar!',
          time: '15:00',
          sent: true
        },
        {
          id: 2,
          person: 'Dan Popescu',
          avatar: 'https://cdn.quasar.dev/team/dan_popescu.jpg',
          caption: 'I\'m working on Quasar!',
          time: '16:00',
          sent: true
        },
        {
          id: 3,
          person: 'Denjell Thompson-Yvetot',
          avatar: 'https://cdn.quasar.dev/team/daniel_thompson-yvetot.jpg',
          caption: 'I\'m working on Quasar!',
          time: '17:00',
          sent: true
        },
        {
          id: 4,
          person: 'Jeff Galbraith',
          avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
          caption: 'I\'m working on Quasar!',
          time: '18:00',
          sent: true
        }
      ]
    }
  },
  computed: {
    currentConversation () {
      return this.conversations[this.currentConversationIndex]
    }
  }
}
</script>

<style lang="stylus">
.q-layout-container
  margin 0 auto
  z-index 4000

.whatsapp-container
  height 100vh
  &::after
    content ""
    height 127px
    position fixed
    top 0
    width 100%
    background-color #009688

.q-field--outlined .q-field__control:before
  border none

.q-icon
  opacity .45

.conversation__summary
  margin-top 4px

.conversation__more
  margin-top 0!important
  font-size 1.4rem
</style>
