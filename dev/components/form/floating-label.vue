<!--
ISSUES:
  #174 - Floating label won't float if input is disabled (even if it contains value)
  #237 - Floating label doesn't work on input[type=email] when value is not valid e.g...
        <div class="floating-label">
          <input required="required" type="email" class="full-width">
        <label>Email</label></div>

  NB: Valid, disabled, focusded
  NB: textarea, text[type=input, password, ], ...
        color
        date
        datetime
        datetime-local
       *email
        month
        number
        range
        search
        tel
        time
        url
        week
-->

<template>
  <div>

    <div class="layout-padding">

      <p class="caption strong">Floating Labels (default)</p>

      <q-float-label label="Floating Label" >
        <input class="full-width">
      </q-float-label>

      <q-float-label label="Floating Label + Icon" icon="call">
        <input class="full-width">
      </q-float-label>

      <q-float-label label="Floating Label + Dense" :dense="true">
        <input>
      </q-float-label>

      <q-float-label label="Floating Label + Icon + Dense" icon="mail_outline" :dense="true">
        <input>
      </q-float-label>

      <p class="caption">Stacked Layout</p>

      <q-float-label label="Stacked Label" layout="stacked">
        <input class="full-width">
      </q-float-label>

      <q-float-label label="Stacked Label + Icon" icon="photo" layout="stacked">
        <input class="full-width">
      </q-float-label>

      <q-float-label label="Stacked Label + Dense" :dense="true" layout="stacked">
        <input>
      </q-float-label>

      <q-float-label label="Stacked Label + Icon + Dense" icon="portrait":dense="true" layout="stacked">
        <input>
      </q-float-label>


      <p class="caption">Inline Layout</p>

      <q-float-label label="Inline Label" layout="inline">
        <input>
      </q-float-label>

      <q-float-label label="Inline Label + Icon" icon="face" layout="inline">
        <input>
      </q-float-label>

      <q-float-label label="Inline Label + Dense" :dense="true" layout="inline">
        <input>
      </q-float-label>

      <q-float-label label="Inline Label + Icon + Dense" icon="search":dense="true" layout="inline">
        <input>
      </q-float-label>



      <p class="caption">Input Types</p>

      <q-float-label label="Email">
        <input type="email" class="full-width">
      </q-float-label>

      <q-float-label label="Password">
        <input type="password" class="full-width">
      </q-float-label>

      <q-float-label label="Text (disabled)">
        <input disabled="true" class="full-width">
      </q-float-label>

      <q-float-label label="Email (readonly)">
        <input type="email" readonly="true" value="professor.plum@study.com" class="full-width">
      </q-float-label>

      <q-float-label label="Text (required)">
        <input required class="full-width">
      </q-float-label>

      <q-float-label label="Text (has-error)" icon="build">
        <input value="Revolver" class="full-width has-error">
      </q-float-label>



      <p class="caption">Textareas</p>

      <q-float-label label="Textarea">
        <textarea class="full-width"></textarea>
      </q-float-label>

      <q-float-label label="Textarea + Icon" icon="comments">
        <textarea rows="5" class="full-width">If you end your movement in a room, you get to make a suggestion. To do this, name a suspect, a murder weapon, and the room you just entered. For example, if you just entered the lounge, you might say, "I suggest the crime was committed by Colonel Mustard, in the lounge, with a dagger." The named suspect and murder weapon are both moved into your current room.</textarea>
      </q-float-label>


      <q-float-label label="Textarea + Icon + Dense (has-error)" icon="fingerprint" :dense="true">
        <textarea rows="5" class="full-width has-error">The player to your left must disprove your suggestion by showing you one card from her hand that matches your suggestion. If that player can't do so, the player to her left must disprove your suggestion by showing you one card from his hand. This responsibility passes clockwise until someone shows you a card, or until all players have passed.</textarea>
      </q-float-label>

      <q-float-label label="Textarea (readonly)">
        <textarea rows="4" readonly class="full-width">If someone shows you a card, you should cross it off on your detective notebook as a possibility. Any cards you hold should also be crossed off as possibilities. Don't let other players see your notebook.</textarea>
      </q-float-label>

      <q-float-label label="Textarea (disabled)">
        <textarea rows="4" disabled class="full-width">If you think you have solved the case by eliminating all the false possibilities and have not just had your suggestion disproved this turn, you can end your turn by making an accusation. Announce that you are making an accusation, and state your final guess of the murderer, the murder weapon, and the murder location.</textarea>
      </q-float-label>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
