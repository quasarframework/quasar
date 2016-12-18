<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see it in action.
      </p>

      <div class="list" style="max-width: 600px;">
        <div
          class="item item-link"
          v-for="dialog in types"
          @click="dialog.handler()"
        >
          <i class="item-primary">{{dialog.icon}}</i>
          <div class="item-content has-secondary">
            <div>{{dialog.label}}</div>
          </div>
          <i class="item-secondary">keyboard_arrow_right</i>
        </div>
        <hr>
        <div class="list-label">With Form Components</div>
        <div
          class="item item-link"
          v-for="dialog in form"
          @click="dialog.handler()"
        >
          <i class="item-primary">{{dialog.icon}}</i>
          <div class="item-content has-secondary">
            <div>{{dialog.label}}</div>
          </div>
          <i class="item-secondary">keyboard_arrow_right</i>
        </div>
      </div>

      <p class="caption">Form components can be combined and named however you wish. Check source code.</p>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'quasar'

export default {
  data () {
    return {
      types: [
        {
          label: 'Alert',
          icon: 'warning',
          handler () {
            Dialog.create({
              title: 'Alert',
              message: 'Modern HTML5 Single Page Application front-end framework on steroids.'
            })
          }
        },
        {
          label: 'Confirm',
          icon: 'done_all',
          handler () {
            Dialog.create({
              title: 'Confirm',
              message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
              buttons: [
                {
                  label: 'Disagree',
                  handler () {
                    Toast.create('Disagreed...')
                  }
                },
                {
                  label: 'Agree',
                  handler () {
                    Toast.create('Agreed!')
                  }
                }
              ]
            })
          }
        },
        {
          label: 'Custom CSS classes & style to buttons',
          icon: 'format_color_fill',
          handler () {
            Dialog.create({
              title: 'Confirm',
              message: 'Custom button classes.',
              buttons: [
                {
                  label: 'Disagree',
                  classes: 'negative clear',
                  style: 'text-decoration: underline'
                },
                {
                  label: 'Agree',
                  classes: 'positive'
                }
              ]
            })
          }
        },
        {
          label: 'Stacked Buttons Example',
          icon: 'reorder',
          handler () {
            Dialog.create({
              title: 'Favorite Superhero',
              message: 'What is your superhero of choice?',
              stackButtons: true,
              buttons: [
                {
                  label: 'Choose Superman',
                  handler () {
                    console.log('Superman.')
                  }
                },
                {
                  label: 'Choose Batman',
                  handler () {
                    console.log('Batman.')
                  }
                },
                {
                  label: 'Choose Spiderman',
                  handler () {
                    console.log('Spiderman.')
                  }
                },
                {
                  label: 'No Thanks',
                  handler () {
                    console.log('Ok, no superhero.')
                  }
                }
              ]
            })
          }
        },
        {
          label: 'Determined Progress',
          icon: 'hourglass_empty',
          handler () {
            let progress = {
              model: 25
            }

            const dialog = Dialog.create({
              title: 'Progress',
              message: 'Computing...',
              progress,
              buttons: [
                {
                  label: 'Cancel',
                  handler () {
                    clearInterval(timeout)
                    Toast.create('Canceled on progress ' + progress.model)
                  }
                }
              ]
            })

            const timeout = setInterval(() => {
              progress.model += Math.floor(Math.random() * 5) + 1
              if (progress.model >= 42) {
                clearInterval(timeout)
                dialog.close()
              }
            }, 500)
          }
        },
        {
          label: 'Indeterminate Progress',
          icon: 'hourglass_full',
          handler () {
            const dialog = Dialog.create({
              title: 'Progress',
              message: 'Computing...',
              progress: {
                indeterminate: true
              },
              buttons: [
                {
                  label: 'Cancel',
                  handler (data) {
                    clearTimeout(timeout)
                    Toast.create('Canceled...')
                  }
                }
              ]
            })

            const timeout = setTimeout(() => {
              clearInterval(timeout)
              dialog.close()
            }, 3000)
          }
        }
      ],
      form: [
        {
          label: 'Textfields',
          icon: 'help',
          handler () {
            Dialog.create({
              title: 'Prompt',
              message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
              form: {
                name: {
                  type: 'textbox',
                  label: 'Textbox',
                  model: ''
                },
                age: {
                  type: 'numeric',
                  label: 'Numeric',
                  model: 10,
                  min: 5,
                  max: 90
                },
                tags: {
                  type: 'chips',
                  label: 'Chips',
                  model: ['Joe', 'John']
                },
                comments: {
                  type: 'textarea',
                  label: 'Textarea',
                  model: ''
                }
              },
              buttons: [
                'Cancel',
                {
                  label: 'Ok',
                  handler (data) {
                    Toast.create('Returned ' + JSON.stringify(data))
                  }
                }
              ]
            })
          }
        },
        {
          label: 'Single Selection',
          icon: 'radio_button_checked',
          handler () {
            Dialog.create({
              title: 'Radios',
              message: 'Message can be used for all types of Dialogs.',
              form: {
                option: {
                  type: 'radio',
                  model: 'opt1',
                  items: [
                    {label: 'Option 1', value: 'opt1'},
                    {label: 'Option 2', value: 'opt2'},
                    {label: 'Option 3', value: 'opt3'}
                  ]
                }
              },
              buttons: [
                'Cancel',
                {
                  label: 'Ok',
                  handler (data) {
                    Toast.create('Returned ' + JSON.stringify(data))
                  }
                }
              ]
            })
          }
        },
        {
          label: 'Multiple Selection',
          icon: 'check_box',
          handler () {
            Dialog.create({
              title: 'Checkbox & Toggle',
              message: 'Message can be used for all types of Dialogs.',
              form: {
                header1: {
                  type: 'heading',
                  label: 'Checkboxes'
                },
                group1: {
                  type: 'checkbox',
                  items: [
                    {label: 'Option 1', value: 'opt1', model: true},
                    {label: 'Option 2', value: 'opt2', model: false},
                    {label: 'Option 3', value: 'opt3', model: false}
                  ]
                },
                header2: {
                  type: 'heading',
                  label: 'Toggles'
                },
                group2: {
                  type: 'toggle',
                  items: [
                    {label: 'Option 1', value: 'opt1', model: true},
                    {label: 'Option 2', value: 'opt2', model: false},
                    {label: 'Option 3', value: 'opt3', model: false}
                  ]
                }
              },
              buttons: [
                'Cancel',
                {
                  label: 'Ok',
                  handler (data) {
                    Toast.create('Returned ' + JSON.stringify(data))
                  }
                }
              ]
            })
          }
        },
        /*
        {
          label: 'Ranges',
          icon: 'help',
          handler () {
            Dialog.create({
              title: 'Ranges',
              form: {
                range: {
                  type: 'range',
                  label: 'Range',
                  min: 10,
                  max: 20,
                  withLabel: true,
                  model: 12
                },
                doubleRange: {
                  type: 'double-range',
                  label: 'Double Range',
                  model: {
                    min: 7,
                    max: 12
                  },
                  min: 5,
                  max: 15,
                  withLabel: true
                },
                step: {
                  type: 'range',
                  label: 'With step & snap',
                  model: -6,
                  min: -10,
                  max: 10,
                  step: 4,
                  snap: true,
                  markers: true,
                  withLabel: true
                }
              },
              buttons: [
                'Cancel',
                {
                  label: 'Ok',
                  handler (data) {
                    Toast.create('Returned ' + JSON.stringify(data))
                  }
                }
              ]
            })
          }
        },
        */
        {
          label: 'Rating',
          icon: 'star_half',
          handler () {
            Dialog.create({
              title: 'Rating',
              form: {
                rating: {
                  type: 'rating',
                  label: 'How many stars?',
                  model: 0,
                  max: 5
                },
                rating2: {
                  type: 'rating',
                  label: 'How many pencils?',
                  model: 3,
                  max: 6,
                  icon: 'create'
                }
              },
              buttons: [
                'Cancel',
                {
                  label: 'Ok',
                  handler (data) {
                    Toast.create('Returned ' + JSON.stringify(data))
                  }
                }
              ]
            })
          }
        }
      ]
    }
  }
}
</script>
