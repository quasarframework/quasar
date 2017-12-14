<template>
  <div>
    <div class="layout-padding">
      <p class="light-paragraph">
        You'll learn the <strong>List basics</strong> here then you can jump to the other sections
        to see how you can beatifully combine the List elements.
      </p>

      <p class="caption">Basic List</p>
      <q-list>
        <q-item>
          <q-item-main label="List Item" />
        </q-item>
        <q-item>
          <q-item-main>
            <span slot="label">List Item</span>
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">Dense List</p>
      <q-list dense>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>
      <q-list>
        <q-item :key="n" v-for="n in 3" dense>
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Sparse List</p>
      <q-list sparse>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>
      <q-list>
        <q-item :key="n" v-for="n in 3" sparse>
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">No Border</p>
      <q-list no-border>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Striped</p>
      <q-list striped>
        <q-item :key="n" v-for="n in 6">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <q-list striped-odd>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Separator Between Items</p>
      <q-list>
        <q-item>
          <q-item-main label="List Item" />
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-main label="List Item" />
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Separator within Items</p>
      <q-list separator>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <q-list>
        <q-item :key="n" v-for="n in 3" separator>
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Inset Separator within Items</p>
      <q-list inset-separator>
        <q-item :key="n" v-for="n in 3">
          <q-item-main inset label="List Item" />
        </q-item>
      </q-list>

      <q-list>
        <q-item :key="n" v-for="n in 3" inset-separator>
          <q-item-main inset label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Router Links</p>
      <q-list>
        <q-item to="/" exact v-for="n in 2" :key="n">
          <q-item-main inset label="Go to Home" />
        </q-item>
      </q-list>

      <p class="caption">List Labels</p>
      <q-list>
        <q-list-header>List Label</q-list-header>
        <q-item :key="n" v-for="n in 2">
          <q-item-main label="List Item" />
        </q-item>
        <q-item-separator />
        <q-list-header>Another List Label</q-list-header>
        <q-item :key="n" v-for="n in 3">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Inset: Items, Separators and Labels</p>
      <q-list>
        <q-item>
          <q-item-main inset label="List Item" />
        </q-item>
        <q-item-separator inset />
        <q-list-header inset>Inset List Label</q-list-header>
        <q-item :key="n" v-for="n in 2">
          <q-item-main inset label="List Item" />
        </q-item>
        <q-item-separator inset />
        <q-item>
          <q-item-main inset label="List Item" />
        </q-item>
      </q-list>

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
      <q-list highlight>
        <q-item :key="n" v-for="n in 2">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

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
      <q-list link>
        <q-item :key="n" v-for="n in 2">
          <q-item-main label="List Item" />
        </q-item>
      </q-list>

      <p class="caption">Primary</p>
      <q-list inset-separator>
        <q-item>
          <q-item-side icon="assignment_ind" />
          <q-item-main label="Icon as Primary" />
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Avatar as Primary" />
        </q-item>
        <q-item>
          <q-item-side letter="Q" />
          <q-item-main label="One character as Primary" />
        </q-item>
      </q-list>
      <q-list inset-separator>
        <q-item>
          <q-item-side icon="assignment_ind" />
          <q-item-main label="Icon as Primary" />
        </q-item>
        <q-item>
          <q-item-side icon="cloud" />
          <q-item-main label="Icon as Primary" />
        </q-item>
        <q-item>
          <q-item-side icon="wifi" />
          <q-item-main label="Icon as Primary" />
        </q-item>
        <q-item>
          <q-item-side icon="bluetooth" />
          <q-item-main label="Icon as Primary" />
        </q-item>
        <q-item>
          <q-item-side icon="data_usage" />
          <q-item-main label="Icon as Primary" />
        </q-item>
      </q-list>

      <p class="caption">Secondary</p>
      <q-list>
        <q-item>
          <q-item-main label="Icon as Secondary" />
          <q-item-side right icon="info" />
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-main label="Icon as Secondary" />
          <q-item-side right avatar="/statics/boy-avatar.png" />
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-main label="Icon as Secondary" />
          <q-item-side right letter="Q" />
        </q-item>
      </q-list>

      <p class="caption">Example Items with Primary and Secondary</p>
      <q-list inset-separator>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Jack" />
          <q-item-side right icon="chat_bubble" />
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/linux-avatar.png" />
          <q-item-main label="Jim's Photos" />
          <q-item-side right image="/statics/mountains.jpg" />
        </q-item>
        <q-item>
          <q-item-side icon="voice_chat" />
          <q-item-main label="Voice Chat with Joe" />
          <q-item-side right avatar="/statics/boy-avatar.png" />
        </q-item>
        <q-item>
          <q-item-side inverted icon="voice_chat" />
          <q-item-main label="Voice Chat with Joe" />
          <q-item-side right avatar="/statics/boy-avatar.png" />
        </q-item>
        <q-item>
          <q-item-side letter="J" />
          <q-item-main label="John Doe" />
          <q-item-side right avatar="/statics/boy-avatar.png" />
        </q-item>
      </q-list>

      <p class="caption">Stamp and Truncated Content</p>
      <q-list highlight inset-separator style="max-width: 400px">
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Brunch this weekend? Brunch this weekend? Brunch this weekend?" label-lines="1" />
          <q-item-side right stamp="1 min" />
        </q-item>
        <q-item multiline>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main
            label="Brunch this weekend? Brunch this weekend? Brunch this weekend?"
            label-lines="1"
            sublabel="John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe"
            sublabel-lines="2"
          />
          <q-item-side right stamp="1 week<br>ago" />
        </q-item>
        <q-item multiline>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main
            label="Brunch this weekend? Brunch this weekend? Brunch this weekend?"
            label-lines="1"
            sublabel="John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe"
          />
          <q-item-side right stamp="10 min" />
        </q-item>

        <q-item multiline>
          <q-item-side>
            <q-item-tile avatar>
              <img src="~assets/boy-avatar.png" />
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Brunch <span>5</span></q-item-tile>
            <q-item-tile sublabel lines="2">John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>10 min</q-item-tile>
          </q-item-side>
        </q-item>

        <q-item multiline>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label lines="1">Brunch this weekend? Yeah, this weekend. Really. This one.</q-item-tile>
            <q-item-tile sublabel lines="2">
              <span>John Doe</span>
              -- I'll be in your neighborhood doing errands this
              weekend. Do you want to grab brunch?
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>2 years</q-item-tile>
            <q-item-tile icon="mail" />
          </q-item-side>
        </q-item>
      </q-list>

      <p class="caption">Item with different secondaries</p>
      <q-list inset-separator>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Brunch this weekend?" />
          <q-item-side right icon="more_vert">
            <q-popover ref="popover">
              <q-list link>
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Reply" />
                </q-item>
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Forward" />
                </q-item>
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Delete" />
                </q-item>
              </q-list>
            </q-popover>
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Brunch this weekend?" />
          <q-item-side right>
            <q-chip square color="primary" class="shadow-2">10k</q-chip>
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="Brunch this weekend?" />
          <q-item-side right>
            <q-item-tile stamp>10 min ago</q-item-tile>
            <span class="text-amber">
              <q-item-tile icon="star" v-for="n in 2" :key="n" />
            </span>
          </q-item-side>
        </q-item>
      </q-list>

      <q-list>
        <q-collapsible icon="inbox" indent label="Inbox" sublabel="Where your email is">
          <q-item v-for="n in 3" :key="n">
            <q-item-side icon="mail" />
            <q-item-main :label="`Email ${n + 1}`" />
          </q-item>
          <q-collapsible icon="favorite" label="Favorites">
            <q-item v-for="n in 3" :key="n">
              <q-item-side icon="mail" />
              <q-item-main :label="`Favorite ${n + 1}`" />
            </q-item>
          </q-collapsible>
          <q-item>
            <q-item-side icon="mail" />
            <q-item-main label="Email" />
          </q-item>
        </q-collapsible>
        <q-collapsible icon="send" label="Sent">
          <q-item v-for="n in 3" :key="n">
            <q-item-side icon="mail" />
            <q-item-main :label="`Email ${n + 1}`" />
          </q-item>
        </q-collapsible>
        <q-collapsible icon="delete" label="Trash">
          <q-item v-for="n in 3" :key="n">
            <q-item-side icon="mail" />
            <q-item-main :label="`Email ${n + 1}`" />
          </q-item>
        </q-collapsible>
      </q-list>

      <q-list highlight>
        <q-list-header>Recent chats</q-list-header>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="John Doe" />
          <q-item-side right>
            <q-item-tile icon="chat_bubble" color="green" />
          </q-item-side>
        </q-item>
        <q-item v-for="n in 3" :key="n">
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main label="John Doe" />
          <q-item-side right icon="chat_bubble" />
        </q-item>
        <q-item-separator />
        <q-list-header>Previous chats</q-list-header>
        <q-item v-for="n in 3" :key="n">
          <q-item-side avatar="/statics/guy-avatar.png" />
          <q-item-main label="Jack Doe" />
        </q-item>
      </q-list>

      <q-list>
        <q-item v-for="n in 3" :key="n">
          <q-item-side icon="star" color="yellow" />
          <q-item-main label="John Joe" />
          <q-item-side right>
            <q-item-tile avatar>
              <img src="~assets/boy-avatar.png">
            </q-item-tile>
          </q-item-side>
        </q-item>
        <q-item-separator inset />
        <q-item v-for="n in 3" :key="n">
          <q-item-side letter="A" />
          <q-item-main label="John Joe" />
          <q-item-side right avatar="/statics/boy-avatar.png" />
        </q-item>
        <q-list-header inset>Normal - default color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side letter="A" />
          <q-item-main label="John Joe" />
          <q-item-side right icon="alarm" />
          <q-item-side right stamp="Stamp" />
        </q-item>
        <q-list-header inset>Normal - with color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side letter="A" :color="`red-${n + 2}`" />
          <q-item-main label="John Joe" />
          <q-item-side right icon="alarm" :color="`red-${n + 2}`" />
          <q-item-side right stamp="Stamp" :color="`red-${n + 2}`" />
        </q-item>
        <q-list-header inset>Inverted - default color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side letter="A" inverted />
          <q-item-main label="John Joe" />
          <q-item-side right icon="alarm" inverted />
        </q-item>
        <q-list-header inset>Inverted - with color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side letter="A" inverted :color="`red-${n + 2}`" />
          <q-item-main label="John Joe" />
          <q-item-side right icon="alarm" inverted :color="`red-${n + 2}`" />
        </q-item>
        <q-list-header inset>Normal - Tile - default color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side>
            <q-item-tile letter>A</q-item-tile>
          </q-item-side>
          <q-item-main label="John Joe" />
          <q-item-side right>
            <q-item-tile icon="alarm" />
          </q-item-side>
          <q-item-side right>
            <q-item-tile stamp>Stamp</q-item-tile>
          </q-item-side>
        </q-item>
        <q-list-header inset>Normal - Tile - with color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side>
            <q-item-tile letter :color="`red-${n + 2}`">A</q-item-tile>
          </q-item-side>
          <q-item-main label="John Joe" />
          <q-item-side right>
            <q-item-tile icon="alarm" :color="`red-${n + 2}`" />
          </q-item-side>
          <q-item-side right>
            <q-item-tile stamp :color="`red-${n + 2}`">Stamp</q-item-tile>
          </q-item-side>
        </q-item>
        <q-list-header inset>Inverted - Tile - default color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side>
            <q-item-tile letter inverted>A</q-item-tile>
          </q-item-side>
          <q-item-main label="John Joe" />
          <q-item-side right>
            <q-item-tile icon="alarm" inverted />
          </q-item-side>
        </q-item>
        <q-list-header inset>Inverted - Tile - with color</q-list-header>
        <q-item v-for="n in 3" :key="n" link>
          <q-item-side>
            <q-item-tile letter inverted :color="`red-${n + 2}`">A</q-item-tile>
          </q-item-side>
          <q-item-main label="John Joe" />
          <q-item-side right>
            <q-item-tile icon="alarm" inverted :color="`red-${n + 2}`" />
          </q-item-side>
        </q-item>
      </q-list>

      <q-list>
        <q-list-header inset>Folders</q-list-header>
        <q-item v-for="n in 3" :key="n">
          <q-item-side icon="folder" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Photos</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
        <q-item-separator inset />
        <q-list-header inset>Files</q-list-header>
        <q-item v-for="n in 3" :key="n">
          <q-item-side icon="assignment" inverted color="grey-6" />
          <q-item-main>
            <q-item-tile label>Vacation</q-item-tile>
            <q-item-tile sublabel>February 22, 2016</q-item-tile>
          </q-item-main>
          </q-item-side right icon="info" />
        </q-item>
      </q-list>

      <p class="caption">Settings</p>
      <q-list link>
        <q-list-header>User controls</q-list-header>
        <q-item>
          <q-item-main>
            <q-item-tile label>Content filtering</q-item-tile>
            <q-item-tile sublabel>Set the content filtering level to restrict apps that can be downloaded</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>Password</q-item-tile>
            <q-item-tile sublabel>Require password for purchase or use password to restrict purchase</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>General</q-list-header>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="checked" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Notifications</q-item-tile>
            <q-item-tile sublabel>Notify me about updates to apps or games that I downloaded</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="checked" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Sound</q-item-tile>
            <q-item-tile sublabel>Auto-update apps at anytime. Data charges may apply</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="checked" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Auto-add widgets</q-item-tile>
            <q-item-tile sublabel>Automatically add home screen widgets</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">More form components examples</p>
      <q-list link>
        <q-list-header>Radios</q-list-header>
        <q-item tag="label">
          <q-item-side>
            <q-radio v-model="option" val="opt1"></q-radio>
          </q-item-side>
          <q-item-main label="Option 1" />
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-radio color="purple" v-model="option" val="opt2"></q-radio>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Option 2</q-item-tile>
            <q-item-tile sublabel>Allows notifications</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-radio color="red" v-model="option" val="opt3"></q-radio>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Option 3</q-item-tile>
            <q-item-tile sublabel lines="3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>

      <q-list link>
        <q-list-header>Toggles</q-list-header>
        <q-item tag="label">
          <q-item-main label="Events and reminders" />
          <q-item-side right>
            <q-toggle v-model="checked"></q-toggle>
          </q-item-side>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-main>
            <q-item-tile label>Events and reminders</q-item-tile>
            <q-item-tile sublabel>Lorem ipsum</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-toggle v-model="checked" color="purple"></q-toggle>
          </q-item-side>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-main>
            <q-item-tile label>Events and reminders</q-item-tile>
            <q-item-tile sublabel lines="3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-toggle v-model="checked" color="red"></q-toggle>
          </q-item-side>
        </q-item>
      </q-list>

      <p class="caption">More form components examples</p>
      <q-list>
        <q-list-header>Selects</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select class="full-width" v-model="select" :options="selectOptions" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select class="full-width" multiple checkbox v-model="multipleSelect" :options="selectOptions" />
          </q-item-main>
        </q-item>

        <q-item-separator />
        <q-list-header>Ranges</q-list-header>
        <q-item>
          <q-item-side icon="volume_down" />
          <q-item-main>
            <q-slider v-model="slider" :min="0" :max="50" label />
          </q-item-main>
          <q-item-side right icon="volume_up" />
        </q-item>
        <q-item>
          <q-item-side icon="volume_down" />
          <q-item-main>
            <q-slider v-model="slider" :min="0" :max="50" label />
          </q-item-main>
          <q-item-side right icon="volume_up" />
        </q-item>
        <q-item>
          <q-item-side icon="euro_symbol" />
          <q-item-main>
            <q-range v-model="range" :min="0" :max="50" label />
          </q-item-main>
        </q-item>
      </q-list>

      <q-list>
        <q-list-header>Movies</q-list-header>
        <q-item>
          <q-item-side image="/statics/mountains.jpg" />
          <q-item-main label="Mountains Documentary" />
          <q-item-side right icon="movie" />
        </q-item>
        <q-item>
          <q-item-side image="/statics/mountains.jpg" />
          <q-item-main>
            <q-item-tile label>Mountains Documentary</q-item-tile>
            <q-item-tile sublabel>For passionates only</q-item-tile>
          </q-item-main>
          <q-item-side right icon="movie" />
        </q-item>
        <q-item>
          <q-item-side image="/statics/mountains.jpg" />
          <q-item-main>
            <q-item-tile label>Mountains Documentary</q-item-tile>
            <q-item-tile sublabel lines="3">
              For passionates only For passionates only For passionates only For passionates only For passionates only
            </q-item-tile>
          </q-item-main>
          <q-item-side right icon="movie" />
        </q-item>
      </q-list>

      <q-list>
        <q-list-header>People</q-list-header>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label>John</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile icon="chat_bubble" color="green" />
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label>Jim</q-item-tile>
            <q-item-tile sublabel>Javascript wiz kid</q-item-tile>
          </q-item-main>
          <q-item-side right icon="chat_bubble" />
        </q-item>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label>Jake</q-item-tile>
            <q-item-tile sublabel>Passionate about Quasar</q-item-tile>
          </q-item-main>
          <q-item-side right icon="chat_bubble" />
        </q-item>
      </q-list>

      <q-list>
        <q-item v-for="n in 3" :key="n">
          <q-item-side icon="phone" color="primary" v-if="n === 1" />
          <q-item-main :inset="n > 1">
            <q-item-tile label>(650) 555 - 1234</q-item-tile>
            <q-item-tile sublabel>Mobile</q-item-tile>
          </q-item-main>
          <q-item-side right icon="chat_bubble" />
        </q-item>
        <q-item-separator inset />
        <q-item v-for="n in 3" :key="n">
          <q-item-side icon="mail" color="primary" v-if="n === 1" />
          <q-item-main :inset="n > 1">
            <q-item-tile label>john@doe.com</q-item-tile>
            <q-item-tile sublabel>Personal</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>

      <q-list link>
        <q-item>
          <q-item-side icon="inbox" />
          <q-item-main label="Inbox" />
        </q-item>
        <q-item>
          <q-item-side icon="send" />
          <q-item-main label="Sent" />
        </q-item>
        <q-item>
          <q-item-side icon="delete" />
          <q-item-main label="Trash" />
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-main label="Inbox" />
          <q-item-side right icon="inbox" />
        </q-item>
        <q-item>
          <q-item-main label="Sent" />
          <q-item-side right icon="send" />
        </q-item>
        <q-item>
          <q-item-main label="Trash" />
          <q-item-side right icon="delete" />
        </q-item>
      </q-list>
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
      slider: 20,
      range: {
        min: 10,
        max: 35
      }
    }
  }
}
</script>
