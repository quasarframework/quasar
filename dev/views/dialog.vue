<template>
  <button class="primary" @click="alert()">Alert</button>
  <button class="primary" @click="prompt()">Prompt</button>
  <button class="primary" @click="confirm()">Confirm</button>
  <button class="primary" @click="radio()">Radio</button>
  <button class="primary" @click="checkbox()">Checkbox</button>
  <button class="primary" @click="checkbox(true)">Toggle</button>
  <button class="primary" @click="range()">Range</button>
  <button class="primary" @click="progress()">Progress</button>

  <br>
  <button class="primary" @click="stacked()">Stacked Buttons</button>
</template>

<script>
import { Dialog } from 'quasar-framework'

export default {
  methods: {
    alert () {
      Dialog.create({
        title: 'Alert',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.'
      }).show()
    },
    progress () {
      let
        dialog,
        timeout,
        progress = {
          model: 25
          // indeterminate: true
        }

      dialog = Dialog.create({
        title: 'Progress',
        message: 'Computing...',
        progress: progress,
        buttons: [
          {
            label: 'Cancel',
            handler (data) {
              clearInterval(timeout)
              console.log('Canceled!', data)
            }
          }
        ]
      }).show()

      timeout = setInterval(() => {
        progress.model++
        if (progress.model === 50) {
          clearInterval(timeout)
          dialog.close()
        }
      }, 1000)
    },
    prompt () {
      Dialog.create({
        title: 'Prompt',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        inputs: [
          {
            name: 'input1',
            label: 'Placeholder 1'
          },
          {
            name: 'input2',
            label: 'Placeholder 2'
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler (data) {
              console.log('OK!', data)
            }
          }
        ]
      }).show()
    },
    confirm () {
      Dialog.create({
        title: 'Confirm',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        buttons: [
          {
            label: 'Disagree',
            handler () {
              console.log('Disagreed...')
            }
          },
          {
            label: 'Agree',
            handler () {
              console.log('Agreed!')
            }
          }
        ]
      }).show()
    },
    stacked () {
      Dialog.create({
        title: 'Confirm',
        message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        stackButtons: true,
        buttons: [
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'Turn on speed boost',
            handler () {
              console.log('Turning on speed boost.')
            }
          },
          {
            label: 'No Thanks',
            handler () {
              console.log('Ok, no speed boost.')
            }
          }
        ]
      }).show()
    },
    radio () {
      Dialog.create({
        title: 'Radios',
        message: 'Message can be used for all types of Dialogs.',
        radios: [
          {
            label: 'Option 1',
            value: 'opt1'
          },
          {
            label: 'Option 2',
            value: 'opt2',
            selected: true
          },
          {
            label: 'Option 3',
            value: 'opt3'
          },
          {
            label: 'Option 4',
            value: 'opt4'
          },
          {
            label: 'Option 5',
            value: 'opt5'
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler (data) {
              console.log('OK!', data)
            }
          }
        ]
      }).show()
    },
    checkbox (toggles) {
      var options = {
        title: toggles ? 'Toggles' : 'Checkboxes',
        buttons: [
          {
            label: 'Cancel',
            handler: () => {}
          },
          {
            label: 'Ok',
            handler (data) {
              console.log('OK!', data)
            }
          }
        ]
      }

      options[toggles ? 'toggles' : 'checkboxes'] = [
        {
          label: 'Option 1',
          value: 'opt1',
          checked: true
        },
        {
          label: 'Option 2',
          value: 'opt2'
        },
        {
          label: 'Option 3',
          value: 'opt3'
        },
        {
          label: 'Option 4',
          value: 'opt4'
        },
        {
          label: 'Option 5',
          value: 'opt5'
        }
      ]

      Dialog.create(options).show()
    },
    range () {
      Dialog.create({
        title: 'Ranges',
        ranges: [
          {
            label: 'Volume',
            min: 1,
            max: 5,
            iconMin: 'volume_down',
            iconMax: 'volume_up'
          },
          {
            label: 'Brightness',
            min: 1,
            max: 5,
            value: 2
          },
          {
            label: 'Speed',
            min: 1,
            max: 10,
            value: 6
          },
          {
            label: 'Noise Level',
            min: 4,
            max: 15
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Change',
            handler (data) {
              console.log('OK!', data)
            }
          }
        ]
      }).show()
    }
  }
}
</script>
