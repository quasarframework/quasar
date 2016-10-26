<template>
  <div>
    <div class="layout-padding">
      <p class="light-paragraph">
        You'll learn the <strong>List basics</strong> here then you can jump to the other sections
        to see how you can beatifully combine the List elements.
      </p>

      <p class="caption">Basic List</p>
      <div class="list">
        <div class="item" v-for="n in 2">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">No Border</p>
      <div class="list no-border">
        <div class="item" v-for="n in 2">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Striped</p>
      <div class="list striped">
        <div class="item" v-for="n in 6">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Delimiter Between Items</p>
      <div class="list">
        <div class="item">
          <div class="item-content">
            List Item
          </div>
        </div>
        <hr>
        <div class="item">
          <div class="item-content">
            List Item
          </div>
        </div>
        <hr>
        <div class="item">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Delimiter within Items</p>
      <div class="list item-delimiter">
        <div class="item" v-for="n in 3">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Platform Delimiter - changes based on Theme</p>
      <div class="list platform-delimiter">
        <div class="item" v-for="n in 3">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Inset Delimiter within Items</p>
      <div class="list item-inset-delimiter">
        <div class="item" v-for="n in 3">
          <div class="item-content inset">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">List Labels</p>
      <div class="list">
        <div class="list-label">List Label</div>
        <div class="item" v-for="n in 2">
          <div class="item-content">
            List Item
          </div>
        </div>
        <hr>
        <div class="list-label">Another List Label</div>
        <div class="item" v-for="n in 3">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Inset: Items, Delimiters and Labels</p>
      <div class="list">
        <div class="item">
          <div class="item-content inset">
            List Item
          </div>
        </div>
        <hr class="inset">
        <div class="list-label inset">Inset List Label</div>
        <div class="item" v-for="n in 2">
          <div class="item-content inset">
            List Item
          </div>
        </div>
        <hr class="inset">
        <div class="item">
          <div class="item-content inset">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">
        Highlight (Desktop only)
        <small>
          <br>
          <span class="mobile-only">
            On desktop, hovering the list items will change their background color temporarily.
          </span>
          <span class="desktop-only">
            Hover the list items to change their background color temporarily.
          </span>
        </small>
      </p>
      <div class="list highlight">
        <div class="item" v-for="n in 2">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">
        Link Items (Desktop only)
        <small>
          <br>
          <span class="mobile-only">
            On desktop, hovering the list items will change their background color temporarily and the cursor will be a pointer.
          </span>
          <span class="desktop-only">
            Hover the list items to change their background color temporarily and change cursor to pointer.
          </span>
        </small>
      </p>
      <div class="list">
        <div class="item item-link" v-for="n in 2">
          <div class="item-content">
            List Item
          </div>
        </div>
      </div>

      <p class="caption">Primary</p>
      <div class="list item-inset-delimiter">
        <div class="item">
          <i class="item-primary">assignment_ind</i>
          <div class="item-content">Icon as Primary</div>
        </div>
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content">Avatar as Primary</div>
        </div>
        <div class="item">
          <img class="item-primary thumbnail" :src="'statics/mountains.jpg'">
          <div class="item-content">Thumbnail as Primary</div>
        </div>
        <div class="item">
          <div class="item-primary">Q</div>
          <div class="item-content">One character as Primary</div>
        </div>
      </div>

      <p class="caption">Secondary</p>
      <div class="list">
        <div class="item">
          <div class="item-content has-secondary">Icon as Secondary</div>
          <i class="item-secondary">info</i>
        </div>
        <hr>
        <div class="item">
          <div class="item-content has-secondary">Avatar as Secondary</div>
          <img class="item-secondary" :src="'statics/boy-avatar.png'">
        </div>
        <hr>
        <div class="item">
          <div class="item-content has-secondary">Thumbnail as Secondary</div>
          <img class="item-secondary thumbnail" :src="'statics/mountains.jpg'">
        </div>
        <hr>
        <div class="item">
          <div class="item-content has-secondary">One character as Secondary</div>
          <div class="item-secondary">Q</div>
        </div>
      </div>

      <p class="caption">Example Items with Primary and Secondary</p>
      <div class="list item-inset-delimiter">
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">Jack</div>
          <i class="item-secondary">chat_bubble</i>
        </div>
        <div class="item">
          <img class="item-primary" :src="'statics/linux-avatar.png'">
          <div class="item-content has-secondary">Jim's Photos</div>
          <img class="item-secondary thumbnail" :src="'statics/mountains.jpg'">
        </div>
        <div class="item">
          <i class="item-primary">voice_chat</i>
          <div class="item-content has-secondary">Voice Chat with Joe</div>
          <img class="item-secondary" :src="'statics/boy-avatar.png'">
        </div>
        <div class="item">
          <div class="item-primary">J</div>
          <div class="item-content has-secondary">John Doe</div>
          <img class="item-secondary" :src="'statics/guy-avatar.png'">
        </div>
      </div>

      <p class="caption">Stamp and Truncated Content</p>
      <div class="list" style="max-width: 400px">
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
        </div>
        <div class="item two-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe </div>
          </div>
          <div class="item-secondary stamp">
            10 min
          </div>
        </div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            2 years
          </div>
          <i class="item-secondary">mail</i>
        </div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            1 week ago
          </div>
          <i class="item-secondary">mail</i>
        </div>
      </div>

      <p class="caption">Item with Actions</p>
      <div class="list">
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Brunch this weekend?</div>
          </div>
          <div class="item-secondary">
            <i>
              more_vert
            </i>

            <quasar-popover ref="popover">
              <div class="list">
                <div class="item item-link" @click="$refs.popover.close()">
                  <div class="item-content">Reply</div>
                </div>
                <div class="item item-link" @click="$refs.popover.close()">
                  <div class="item-content">Forward</div>
                </div>
                <div class="item item-link" @click="$refs.popover.close()">
                  <div class="item-content">Delete</div>
                </div>
              </div>
            </quasar-popover>
          </div>
        </div>
      </div>

      <div class="list" style="max-width: 400px">
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            One line item
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
        </div>
        <hr>
        <div class="item two-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Two line item</div>
            <div>Second line</div>
          </div>
          <div class="item-secondary stamp">
            10 min
          </div>
        </div>
        <hr>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Three line item</div>
            <div>
              <span>Second & Third line</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            2 years
          </div>
          <i class="item-secondary">mail</i>
        </div>
        <hr>
        <div class="item multiple-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Multiple lines item</div>
            <div class="item-label item-smaller">Second line</div>
            <div class="item-label item-smaller">Third line</div>
            <div class="item-label item-smaller">Fourth line</div>
            <div class="item-label item-smaller">...as many as you need!</div>
          </div>
          <div class="item-secondary">
            <i>more_vert</i>
          </div>
        </div>
      </div>

      <div class="list">
        <quasar-collapsible icon="inbox" label="Inbox">
          <div class="item" v-for="n in 3">
            <i class="item-primary">mail</i>
            <div class="item-content">
              Email {{ n + 1 }}
            </div>
          </div>
          <quasar-collapsible icon="favorites" label="Favorites">
            <div class="item" v-for="n in 3">
              <i class="item-primary">mail</i>
              <div class="item-content">
                Favorite {{ n + 1 }}
              </div>
            </div>
          </quasar-collapsible>
        </quasar-collapsible>
        <quasar-collapsible icon="send" label="Sent">
          <div class="item" v-for="n in 3">
            <i class="item-primary">mail</i>
            <div class="item-content">
              Email {{ n + 1 }}
            </div>
          </div>
        </quasar-collapsible>
        <quasar-collapsible icon="delete" label="Trash">
          <div class="item" v-for="n in 3">
            <i class="item-primary">mail</i>
            <div class="item-content">
              Email {{ n + 1 }}
            </div>
          </div>
        </quasar-collapsible>
      </div>

      <div class="list">
        <div class="list-label">Recent chats</div>
        <div class="item" v-for="n in 3">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            John Doe
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
        <hr>
        <div class="list-label">Previous chats</div>
        <div class="item" v-for="n in 3">
          <img class="item-primary" :src="'statics/guy-avatar.png'">
          <div class="item-content">
            Jack Doe
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item" v-for="n in 3">
          <i class="item-primary" v-if="n === 0">star</i>
          <div class="item-content inset has-secondary">
            John Joe
          </div>
          <img class="item-secondary" :src="'statics/boy-avatar.png'">
        </div>
        <hr class="inset">
        <div class="item" v-for="n in 3">
          <div class="item-primary" v-if="n === 0">A</div>
          <div class="item-content inset has-secondary">
            John Joe
          </div>
          <img class="item-secondary" :src="'statics/boy-avatar.png'">
        </div>
      </div>

      <div class="list">
        <div class="list-label inset">Folders</div>
        <div class="item two-lines" v-for="n in 3">
          <div class="item-primary bg-grey-6 text-white">
            <i>folder</i>
          </div>
          <div class="item-content has-secondary">
            <div>Photos</div>
            <div>February 22, 2016</div>
          </div>
          <i class="item-secondary">info</i>
        </div>
        <hr class="inset">
        <div class="list-label inset">Files</div>
        <div class="item two-lines" v-for="n in 3">
          <div class="item-primary bg-primary text-white">
            <i>assignment</i>
          </div>
          <div class="item-content has-secondary">
            <div>Vacation</div>
            <div>February 22, 2016</div>
          </div>
          <i class="item-secondary">info</i>
        </div>
      </div>

      <p class="caption">Checkboxes</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            Notifications
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications </div>
          </div>
        </label>
      </div>

      <p class="caption">Radios</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt1"></quasar-radio>
          </div>
          <div class="item-content">
            Option 1
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt2"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Option 2</div>
            <div>Allows notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt3"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Option 3</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </div>
        </label>
      </div>

      <p class="caption">Toggles</p>
      <div class="list">
        <label class="item">
          <div class="item-content has-secondary">
            Events and reminders
          </div>
          <div class="item-secondary">
            <quasar-toggle v-model="checked"></quasar-toggle>
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Lorem ipsum</div>
          </div>
          <div class="item-secondary">
            <quasar-toggle v-model="checked" class="purple"></quasar-toggle>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </div>
          <div class="item-secondary">
            <quasar-toggle v-model="checked" class="red"></quasar-toggle>
          </div>
        </label>
      </div>

      <p class="caption">Select</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select class="full-width" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select class="full-width" type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-select>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select class="full-width" type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-select>
          </div>
        </div>
      </div>

      <p class="caption">Ranges</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">volume_up</i>
          <div class="item-content">
            <quasar-range v-model="range" :min="0" :max="50" label></quasar-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">brightness_medium</i>
          <div class="item-content">
            <quasar-range v-model="range" :min="0" :max="50" label></quasar-range>
          </div>
        </div>
        <hr>
        <div class="list-label">Double Range</div>
        <div class="item two-lines">
          <i class="item-primary">local_atm</i>
          <div class="item-content">
            <quasar-double-range v-model="doubleRange" :min="0" :max="50" label></quasar-double-range>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">euro_symbol</i>
          <div class="item-content">
            <quasar-double-range v-model="doubleRange" :min="0" :max="50" label></quasar-double-range>
          </div>
        </div>
      </div>

      <p class="caption">Date and Time</p>
      <div class="list">
        <div class="list-label">Date or Time</div>
        <div class="item two-lines">
          <i class="item-primary">access_time</i>
          <div class="item-content">
            <quasar-datetime class="full-width" v-model="timestamp" type="time"></quasar-datetime>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">update</i>
          <div class="item-content row items-baseline">
            <quasar-datetime class="full-width" v-model="timestamp" type="date"></quasar-datetime>
          </div>
        </div>
        <hr>
        <div class="list-label">Date & Time</div>
        <div class="item two-lines">
          <i class="item-primary">notifications</i>
          <div class="item-content row items-baseline">
            <quasar-datetime class="full-width" v-model="timestamp" type="datetime"></quasar-datetime>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="list-label">Today</div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
        </div>
        <hr class="inset">
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <i class="item-secondary">info</i>
        </div>
        <hr>
        <div class="list-label">Yesterday</div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset">
            <div>Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              <br>
              I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
        </div>
        <hr class="inset">
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              <br>
              I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
          <div class="item-secondary">
            <i>more_vert</i>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="list-label">Movies</div>
        <div class="item">
          <img class="item-primary thumbnail" :src="'statics/mountains.jpg'">
          <div class="item-content has-secondary">
            <div>Mountains Documentary</div>
          </div>
          <i class="item-secondary">
            movie
          </i>
        </div>
        <div class="item two-lines">
          <img class="item-primary thumbnail" :src="'statics/mountains.jpg'">
          <div class="item-content has-secondary">
            <div>Mountains Documentary</div>
            <div>For passionates only</div>
          </div>
          <i class="item-secondary">
            movie
          </i>
        </div>
        <div class="item three-lines">
          <img class="item-primary thumbnail" :src="'statics/mountains.jpg'">
          <div class="item-content has-secondary">
            <div>Mountains Documentary</div>
            <div>For passionates only For passionates only For passionates only For passionates only For passionates only </div>
          </div>
          <i class="item-secondary">
            movie
          </i>
        </div>
      </div>

      <div class="list">
        <div class="list-label">People</div>
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            John
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
        <div class="item two-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Jim</div>
            <div>Javascript wiz kid</div>
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            <div>Jake</div>
            <div>Passionate about Quasar</div>
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
      </div>

      <div class="list">
        <div class="item two-lines" v-for="n in 3">
          <i class="item-primary" v-if="n === 0">phone</i>
          <div class="item-content inset has-secondary">
            <div>(650) 555 - 1234</div>
            <div>Mobile</div>
          </div>
          <i class="item-secondary">chat_bubble</i>
        </div>
        <hr class="inset">
        <div class="item two-lines" v-for="n in 3">
          <i class="item-primary">mail</i>
          <div class="item-content">
            <div>john@doe.com</div>
            <div>Personal</div>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item">
          <i class="item-primary">inbox</i>
          <div class="item-content">
            Inbox
          </div>
        </div>
        <div class="item">
          <i class="item-primary">send</i>
          <div class="item-content">
            Sent
          </div>
        </div>
        <div class="item">
          <i class="item-primary">delete</i>
          <div class="item-content">
            Trash
          </div>
        </div>
        <hr>
        <div class="item">
          <div class="item-content has-secondary">
            Inbox
          </div>
          <i class="item-secondary">
            inbox
          </i>
        </div>
        <div class="item">
          <div class="item-content has-secondary">
            Sent
          </div>
          <i class="item-secondary">
            send
          </i>
        </div>
        <div class="item">
          <div class="item-content has-secondary">
            Trash
          </div>
          <i class="item-secondary">
            delete
          </i>
        </div>
      </div>

      <div class="list">
        <div class="list-label">Textboxes</div>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input class="full-width">
          </div>
        </div>

        <hr>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input placeholder="Placeholder" class="full-width">
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content row items-center wrap">
            <div style="margin-right: 10px;" class="item-label">Label:</div>
            <input class="auto">
          </div>
        </div>

        <hr>
        <div class="item three-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <input class="full-width">
              <label>Stacked Label</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item three-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <input required class="full-width">
              <label>Floating Label</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="list-label">Textareas</div>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <textarea class="full-width"></textarea>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div style="margin-right: 10px;" class="item-label">Label:</div>
            <textarea class="full-width"></textarea>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <textarea class="full-width"></textarea>
              <label>Stacked Label</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <textarea required class="full-width"></textarea>
              <label>Floating Label</label>
            </div>
          </div>
        </div>

        <hr>

        <div class="list-label">Numeric</div>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <span class="item-label">Number:</span>
            <quasar-numeric v-model="number"></quasar-numeric>
          </div>
        </div>
        <hr class="inset">
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <span class="item-label">Number:</span>
            <quasar-numeric v-model="number"></quasar-numeric>
          </div>
        </div>

        <hr>

        <div class="list-label">Chips Textbox</div>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <quasar-chips v-model="chips" placeholder="Type names"></quasar-chips>
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
      checked: false,
      option: 'opt1',
      select: 'fb',
      multipleSelect: ['goog', 'twtr'],
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ],
      range: 20,
      doubleRange: {
        min: 10,
        max: 35
      },
      timestamp: '2016-09-18T10:45:00.000Z',
      number: 123,
      chips: ['Joe']
    }
  }
}
</script>
