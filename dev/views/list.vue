<template>
  <div class="layout-padding">
    <p class="caption"><strong>Left to do: collapsible</strong></p>
    <div style="width: 360px; max-width: 100%;">

      <p class="caption">Simple List</p>
      <div class="list">
        <div class="item" v-for="n in 3">
          <i class="item-primary">inbox</i>
          <div class="item-content">
            Inbox
          </div>
        </div>
        <hr>
        <div class="item" v-for="n in 3">
          <div class="item-content has-secondary">
            Inbox
          </div>
          <i class="item-secondary">
            info
          </i>
        </div>
      </div>

      <p class="caption">Chat List</p>
      <div class="list">
        <div class="list-label">Recent chats</div>
        <div class="item" v-for="n in 3">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content has-secondary">
            Inbox
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
        <hr>
        <div class="list-label">Previous chats</div>
        <div class="item" v-for="n in 3">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content">
            Inbox
          </div>
        </div>
      </div>

      <p class="caption">Avatar List</p>
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
            <div>Passionate about Vue</div>
          </div>
          <i class="item-secondary">
            chat_bubble
          </i>
        </div>
      </div>

      <p class="caption">Thumbnails List</p>
      <div class="list">
        <div class="list-label">Movies</div>
        <div class="item">
          <img class="item-primary thumbnail" :src="'statics/mountains.jpg'">
          <div class="item-content has-secondary">
            Mountains Documentary
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

      <p class="caption">Contact List</p>
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

      <p class="caption">Folder List</p>
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

      <p class="caption">Settings List</p>
      <div class="list">
        <div class="list-label">General</div>
        <div class="item two-lines" v-for="n in 3">
          <div class="item-content">
            <div>Profile Photo</div>
            <div>Change your Google+ profile photo</div>
          </div>
        </div>

        <hr>
        <div class="list-label">Checkboxes</div>
        <label class="item">
          <div class="item-primary">
            <quasar-checkbox :model.sync="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            Notifications
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-checkbox :model.sync="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-checkbox :model.sync="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications </div>
          </div>
        </label>

        <hr>
        <div class="list-label">Toggles</div>
        <label class="item">
          <div class="item-content has-secondary">
            Events and reminders
          </div>
          <div class="item-secondary">
            <quasar-toggle :model.sync="checked"></quasar-toggle>
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Eveeeents</div>
          </div>
          <div class="item-secondary">
            <quasar-toggle :model.sync="checked"></quasar-toggle>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Eveeeents Eveeeents Eveeeents Eveeeents Eveeeents Eveeeents Eveeeents </div>
          </div>
          <div class="item-secondary">
            <quasar-toggle :model.sync="checked"></quasar-toggle>
          </div>
        </label>

        <hr>
        <div class="list-label">Radios</div>
        <label class="item">
          <div class="item-primary">
            <quasar-radio :model.sync="radio" value="one"></quasar-radio>
          </div>
          <div class="item-content">
            Notifications
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-radio :model.sync="radio" value="two"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-radio :model.sync="radio" value="three"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications </div>
          </div>
        </label>

        <hr>
        <div class="list-label">Ranges</div>
        <div class="item two-lines" v-for="n in 3">
          <i class="item-primary">volume_up</i>
          <div class="item-content row justify-center">
            <quasar-range :model.sync="range" snap label :min="0" :max="10"></quasar-range>
          </div>
        </div>
      </div>

      <p class="caption">Text Fields</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input v-model="text" class="full-width">
          </div>
        </div>

        <hr>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input v-model="text" placeholder="Placeholder" class="full-width">
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content row items-center wrap">
            <div style="margin-right: 10px;">Label:</div>
            <input class="auto" v-model="text">
          </div>
        </div>

        <hr>
        <div class="item three-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <input v-model="text" class="full-width">
              <label>Username</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item three-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="text" required class="full-width">
              <label>Username</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <textarea v-model="multiline" class="full-width"></textarea>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <textarea v-model="multiline" class="full-width"></textarea>
              <label>Username</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <textarea v-model="multiline" required class="full-width"></textarea>
              <label>Username</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <quasar-chips :model.sync="chips" placeholder="Type names"></quasar-chips>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            Number: <quasar-numeric :model.sync="number"></quasar-numeric>
          </div>
        </div>
      </div>

      <p class="caption">Dialog Select</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Radio:</div>
            <quasar-dialog-select class="auto" type="radio" :model.sync="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Radio:</div>
            <quasar-dialog-select class="auto" type="radio" :model.sync="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Checkbox:</div>
            <quasar-dialog-select class="auto" type="checkbox" :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Toggle:</div>
            <quasar-dialog-select class="auto" type="toggle" :model.sync="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
          </div>
        </div>
      </div>

      <p class="caption">Popover Select</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Radio:</div>
            <quasar-select class="auto" type="radio" :model.sync="select" :options="selectOptions" v-ref:sel></quasar-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Radio:</div>
            <quasar-select class="auto" type="radio" :model.sync="select" :options="selectOptions"></quasar-select>
          </div>
        </div>
        <div class="list-label">Multiple Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Checkbox:</div>
            <quasar-select class="auto" type="checkbox" :model.sync="multipleSelect" :options="selectOptions" classes="secondary"></quasar-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <div style="margin-right: 10px;">Toggle:</div>
            <quasar-select class="auto" type="toggle" :model.sync="multipleSelect" :options="selectOptions"></quasar-select>
          </div>
        </div>
      </div>

      <p class="caption">Phone List</p>
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

      <p class="caption">Messages List</p>
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
            <quasar-popover v-ref:popover>
              <i slot="target">
                more_vert
              </i>

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

      <p class="caption">Stamp and Truncate Testing</p>
      <div class="list">
        <div class="item">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
        </div>
        <div class="item two-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe </div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
        </div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            1 week
          </div>
          <i class="item-secondary">mail</i>
        </div>
        <div class="item three-lines">
          <img class="item-primary" :src="'statics/boy-avatar.png'">
          <div class="item-content inset has-secondary">
            <div>Brunch this weekend? Brunch this weekend? Brunch this weekend?</div>
            <div>
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </div>
          </div>
          <div class="item-secondary stamp">
            1 week or more
          </div>
          <i class="item-secondary">mail</i>
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
      radio: 'one',
      range: 4,
      text: '',
      number: 55,
      chips: ['John', 'Jim'],
      multiline: '',
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
      ]
    }
  }
}
</script>
