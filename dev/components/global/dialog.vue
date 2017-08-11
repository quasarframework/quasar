<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see it in action.
      </p>

      <q-list style="max-width: 600px;">
        <q-item
          link
          v-for="dialog in types"
          :key="dialog.label"
          @click="dialog.handler()"
          v-ripple.mat
        >
          <q-item-side :icon="dialog.icon" />
          <q-item-main :label="dialog.label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
        <q-item-separator />
        <q-list-header>With Form Components</q-list-header>
        <q-item
          link
          v-for="dialog in form"
          :key="dialog.label"
          @click="dialog.handler()"
          v-ripple.mat
        >
          <q-item-side :icon="dialog.icon" />
          <q-item-main :label="dialog.label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
        <q-item-separator />
        <q-list-header>Appear from Edges</q-list-header>
        <q-item
          link
          v-for="position in ['top', 'bottom', 'left', 'right']"
          :key="position"
          :position="position"
          @click="showFromEdge(position)"
          v-ripple.mat
        >
          <q-item-side icon="open_with" />
          <q-item-main :label="`Dialog from ${position}`" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
      </q-list>

      <p class="caption">Form components can be combined and named however you wish. Check source code.</p>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'quasar'

export default {
  methods: {
    showFromEdge (position) {
      Dialog.create({
        title: 'Positioned',
        message: `This dialog appears from ${position}.`,
        position
      })
    }
  },
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
                  raised: true,
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
              message: 'Customized buttons.',
              buttons: [
                {
                  label: 'Disagree',
                  color: 'negative',
                  outline: true,
                  style: 'text-decoration: underline'
                },
                {
                  label: 'Agree',
                  color: 'positive'
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
                  color: 'primary',
                  raised: true,
                  handler () {
                    console.log('Ok, no superhero.')
                  }
                }
              ]
            })
          }
        },
        {
          label: 'Prevent Close on Button',
          icon: 'clear',
          handler () {
            Dialog.create({
              title: 'Prevent Close',
              message: 'Having "Prevent" checkbox ticked and then hitting "Try to Close" button will prevent the dialog from closing.',
              form: {
                prevent: {
                  type: 'checkbox',
                  model: ['prevent'],
                  items: [
                    {label: 'Prevent dialog close', value: 'prevent'}
                  ]
                }
              },
              buttons: [
                {
                  label: 'Try to Close',
                  preventClose: true,
                  handler (data, close) {
                    if (!data.prevent.length) {
                      close(() => {
                        Toast.create(`Finally. It's closed now.`)
                      })
                      return
                    }
                    Toast.create('Untick "Prevent" checkbox to be able to close the Dialog.')
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
                  type: 'text',
                  label: 'Textbox',
                  model: ''
                },
                age: {
                  type: 'number',
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
                    {label: 'Option 1', value: 'opt1', color: 'secondary'},
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
                  model: ['opt3'],
                  items: [
                    {label: 'Option 1', value: 'opt1'},
                    {label: 'Option 2', value: 'opt2', color: 'secondary'},
                    {label: 'Option 3', value: 'opt3', color: 'amber'}
                  ]
                },
                header2: {
                  type: 'heading',
                  label: 'Toggles'
                },
                group2: {
                  type: 'toggle',
                  model: ['opt1'],
                  items: [
                    {label: 'Option 1', value: 'opt1'},
                    {label: 'Option 2', value: 'opt2', color: 'secondary'},
                    {label: 'Option 3', value: 'opt3', color: 'amber'}
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
          label: 'Slider & Range',
          icon: 'help',
          handler () {
            Dialog.create({
              title: 'Slider & Range',
              form: {
                slider: {
                  type: 'slider',
                  label: 'Slider',
                  min: 10,
                  max: 20,
                  withLabel: true,
                  model: 12,
                  color: 'secondary'
                },
                range: {
                  type: 'range',
                  label: 'Range',
                  model: {
                    min: 7,
                    max: 12
                  },
                  min: 5,
                  max: 15,
                  withLabel: true
                },
                step: {
                  type: 'slider',
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
