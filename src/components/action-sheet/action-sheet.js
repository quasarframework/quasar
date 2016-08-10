import Modal from '../modal/modal'
import Utils from '../../utils'
import { current as theme } from '../../theme'

import matTemplate from './action-sheet-material.html'
import iosTemplate from './action-sheet-ios.html'

function parseButtons (buttons) {
  if (!Array.isArray(buttons)) {
    throw new Error('Action Sheet buttons parameter must be an array.')
  }

  if (buttons.length <= 1) {
    throw new Error('Action Sheet requires at least one button')
  }

  if (buttons.some(
    button => Object(button) !== button || !button.label || !button.handler
  )) {
    throw new Error('At least one of Action Sheet\'s button parameter is not an object or missing label and/or handler.')
  }

  return buttons.map((button) => {
    if (button.classes) {
      if (Array.isArray(button.classes)) {
        button.classes = button.classes.split(' ')
      }
      else if (typeof button.classes !== 'string') {
        throw new Error('Action Sheet button "classes" parameter must be either an array or string')
      }
    }
    return button
  })
}

function getCSS () {
  if (theme === 'ios') {
    return {
      maxHeight: '80vh',
      height: 'auto',
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  }

  return {
    maxHeight: '80vh',
    height: 'auto'
  }
}

function create (options) {
  let
    data = Utils.extend(true, {}, options),
    modal

  data.buttons = parseButtons(data.buttons)
  data.dismissButton = data.buttons.pop()

  modal = Modal.create({
    template: theme === 'ios' ? iosTemplate : matTemplate,
    data: data
  })
  .css(getCSS())
  .set({
    transitionIn: {translateY: [0, '101%']},
    transitionOut: {translateY: ['101%', 0]}
  })

  modal.$el.classList.remove('items-center')
  modal.$el.classList.add('items-end')
  modal.$backdrop.addEventListener('click', () => {
    modal.close(data.dismissButton.handler)
  })

  return modal
}

export default {
  create
}
