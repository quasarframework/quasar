<template>
  <div>
    <div class="layout-padding" style="max-width: 500px;">
      <div class="chat-other">
        <div class="chat-user">
          <img :src="'statics/linux-avatar.png'">
        </div>
        <div class="chat-date">
          7 minutes ago
        </div>
        <div class="chat-message">
          <p class="bg-orange">
            hey, if you type in your pw, it will show as stars
          </p>
        </div>
      </div>

      <div class="chat-other">
        <div class="chat-user">
          <img :src="'statics/linux-avatar.png'">
        </div>
        <div class="chat-date">
          7 minutes ago
        </div>
        <div class="chat-message">
          <p>
            ********* see!
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          4 minutes ago
        </div>
        <div class="chat-message">
          <p>
            hunter2
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          4 minutes ago
        </div>
        <div class="chat-message">
          <p>
            doesn't look like stars to me
          </p>
        </div>
      </div>

      <div class="chat-other">
        <div class="chat-user">
          <img :src="'statics/linux-avatar.png'">
        </div>
        <div class="chat-date">
          3 minutes ago
        </div>
        <div class="chat-message">
          <p>
            *******... this is what I see. You can also write hunter2-ing my-hunter2 whunter2x.
            People only see ******-ing my-*****...
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          3 minutes ago
        </div>
        <div class="chat-message">
          <p>
            awesome!
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          3 minutes ago
        </div>
        <div class="chat-message">
          <p>
            didn't know that
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          1 minute ago
        </div>
        <div class="chat-message">
          <p>
            wait, how do you know my pw?
          </p>
        </div>
      </div>

      <div class="chat-other">
        <div class="chat-user">
          <img :src="'statics/linux-avatar.png'">
        </div>
        <div class="chat-date">
          A few second ago
        </div>
        <div class="chat-message">
          <p>
            er, I just copy pasted YOUR ******'s and it appears to YOU as hunter2 cause its your pw
          </p>
        </div>
      </div>

      <div class="chat-you">
        <div class="chat-user">
          <img :src="'statics/boy-avatar.png'">
        </div>
        <div class="chat-date">
          Just now
        </div>
        <div class="chat-message">
          <p>
            oh, ok.
          </p>
        </div>
      </div>

      <div class="chat-other">
        <div class="chat-user">
          <img :src="'statics/linux-avatar.png'">
        </div>
        <div class="chat-date">
          Typing...
        </div>
        <div class="chat-message">
          <p>
            <spinner name="dots" color="#fff" :size="30"></spinner>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
