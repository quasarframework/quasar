import { getElement } from './dom.js'
import { isObject } from './is'

let id = 0
let offsetBase = void 0

function getAbsolutePosition (el, resize) {
  if (offsetBase === void 0) {
    offsetBase = document.createElement('div')
    offsetBase.style.cssText = 'position: absolute; left: 0; top: 0'
    document.body.appendChild(offsetBase)
  }

  const boundingRect = el.getBoundingClientRect()
  const baseRect = offsetBase.getBoundingClientRect()
  const { marginLeft, marginRight, marginTop, marginBottom } = window.getComputedStyle(el)
  const marginH = parseInt(marginLeft, 10) + parseInt(marginRight, 10)
  const marginV = parseInt(marginTop, 10) + parseInt(marginBottom, 10)

  return {
    left: boundingRect.left - baseRect.left,
    top: boundingRect.top - baseRect.top,
    width: boundingRect.right - boundingRect.left,
    height: boundingRect.bottom - boundingRect.top,
    widthM: boundingRect.right - boundingRect.left + (resize === true ? 0 : marginH),
    heightM: boundingRect.bottom - boundingRect.top + (resize === true ? 0 : marginV),
    marginH: resize === true ? marginH : 0,
    marginV: resize === true ? marginV : 0
  }
}

function getAbsoluteSize (el) {
  return {
    width: el.scrollWidth,
    height: el.scrollHeight
  }
}

// firefox rulez
const styleEdges = [ 'Top', 'Right', 'Bottom', 'Left' ]
const styleBorderRadiuses = [ 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius' ]
const reStyleSkipKey = /-block|-inline|block-|inline-/
const reStyleSkipRule = /(-block|-inline|block-|inline-).*:/

function getComputedStyle (el, props) {
  const style = window.getComputedStyle(el)
  const fixed = {}
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]

    if (style[prop] === '') {
      if (prop === 'cssText') {
        const styleLen = style.length
        let val = ''

        for (let i = 0; i < styleLen; i++) {
          if (reStyleSkipKey.test(style[i]) !== true) {
            val += style[i] + ': ' + style[style[i]] + '; '
          }
        }

        fixed[prop] = val
      }
      else if ([ 'borderWidth', 'borderStyle', 'borderColor' ].indexOf(prop) > -1) {
        const suffix = prop.replace('border', '')
        let val = ''
        for (let j = 0; j < styleEdges.length; j++) {
          const subProp = 'border' + styleEdges[j] + suffix
          val += style[subProp] + ' '
        }
        fixed[prop] = val
      }
      else if (prop === 'borderRadius') {
        let val1 = ''
        let val2 = ''
        for (let j = 0; j < styleBorderRadiuses.length; j++) {
          const val = style[styleBorderRadiuses[j]].split(' ')
          val1 += val[0] + ' '
          val2 += (val[1] === void 0 ? val[0] : val[1]) + ' '
        }
        fixed[prop] = val1 + '/ ' + val2
      }
      else {
        fixed[prop] = style[prop]
      }
    }
    else {
      if (prop === 'cssText') {
        fixed[prop] = style[prop]
          .split(';')
          .filter(val => reStyleSkipRule.test(val) !== true)
          .join(';')
      }
      else {
        fixed[prop] = style[prop]
      }
    }
  }

  return fixed
}

const zIndexPositions = ['absolute', 'fixed', 'relative', 'sticky']

function getMaxZIndex (elStart) {
  let el = elStart
  let maxIndex = 0

  while (el !== null && el !== document) {
    const { position, zIndex } = window.getComputedStyle(el)
    const zIndexNum = Number(zIndex)

    if (
      zIndexNum > maxIndex &&
      (el === elStart || zIndexPositions.includes(position) === true)
    ) {
      maxIndex = zIndexNum
    }

    el = el.parentNode
  }

  return maxIndex
}

function normalizeElements (opts) {
  return {
    from: opts.from,
    to: opts.to !== void 0
      ? opts.to
      : opts.from
  }
}

function normalizeOptions (options) {
  if (typeof options === 'number') {
    options = {
      duration: options
    }
  }
  else if (typeof options === 'function') {
    options = {
      onEnd: options
    }
  }

  return {
    ...options,

    waitFor: options.waitFor === void 0 ? 0 : options.waitFor,

    duration: isNaN(options.duration) === true ? 300 : parseInt(options.duration, 10),
    easing: typeof options.easing === 'string' && options.easing.length > 0 ? options.easing : 'ease-in-out',
    delay: isNaN(options.delay) === true ? 0 : parseInt(options.delay, 10),
    fill: typeof options.fill === 'string' && options.fill.length > 0 ? options.fill : 'none',

    resize: options.resize === true,
    useCSS: options.useCSS === true,
    hideFromClone: options.hideFromClone === true,
    keepToClone: options.keepToClone === true,

    tween: options.tween === true,
    tweenFromOpacity: isNaN(options.tweenFromOpacity) === true ? 0.6 : parseFloat(options.tweenFromOpacity),
    tweenToOpacity: isNaN(options.tweenToOpacity) === true ? 0.5 : parseFloat(options.tweenToOpacity)
  }
}

function isValidElement (element) {
  return element &&
    element.ownerDocument === document &&
    element.parentNode !== null
}

export default function morph (_options) {
  let cancel = () => false
  let cancelStatus = false
  let endElementTo = true

  const elements = normalizeElements(_options)
  const options = normalizeOptions(_options)

  const elFrom = getElement(elements.from)
  if (isValidElement(elFrom) !== true) {
    // we return a cancel function that return false, meaning the cancel function failed
    return cancel
  }
  // we clean other morphs running on this element
  typeof elFrom.qMorphCancel === 'function' && elFrom.qMorphCancel()

  let animationFromClone = void 0
  let animationFromTween = void 0
  let animationToClone = void 0
  let animationTo = void 0

  const elFromParent = elFrom.parentNode
  const elFromNext = elFrom.nextElementSibling

  // we get the dimensions and characteristics
  // of the parent of the initial element before changes
  const elFromPosition = getAbsolutePosition(elFrom, options.resize)
  const {
    width: elFromParentWidthBefore,
    height: elFromParentHeightBefore
  } = getAbsoluteSize(elFromParent)
  const {
    borderWidth: elFromBorderWidth,
    borderStyle: elFromBorderStyle,
    borderColor: elFromBorderColor,
    borderRadius: elFromBorderRadius,
    backgroundColor: elFromBackground,
    transform: elFromTransform,
    position: elFromPositioningType,
    cssText: elFromCssText
  } = getComputedStyle(elFrom, [ 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'backgroundColor', 'transform', 'position', 'cssText' ])
  const elFromClassSaved = elFrom.classList.toString()
  const elFromStyleSaved = elFrom.style.cssText

  // we make a clone of the initial element and
  // use it to display until the final element is ready
  // and to change the occupied space during animation
  const elFromClone = elFrom.cloneNode(true)
  const elFromTween = options.tween === true ? elFrom.cloneNode(true) : void 0

  if (elFromTween !== void 0) {
    elFromTween.className = elFromTween.classList.toString().split(' ').filter(c => /^bg-/.test(c) === false).join(' ')
  }

  // if the initial element is not going to be removed do not show the placeholder
  options.hideFromClone === true && elFromClone.classList.add('q-morph--internal')

  // prevent interaction with placeholder
  elFromClone.setAttribute('aria-hidden', 'true')
  elFromClone.style.transition = 'none'
  elFromClone.style.animation = 'none'
  elFromClone.style.pointerEvents = 'none'
  elFromParent.insertBefore(elFromClone, elFromNext)

  // we mark the element with its cleanup function
  elFrom.qMorphCancel = () => {
    cancelStatus = true

    // we clean the clone of the initial element
    elFromClone.remove()
    elFromTween !== void 0 && elFromTween.remove()

    options.hideFromClone === true && elFromClone.classList.remove('q-morph--internal')

    // we remove the cleanup function from the element
    elFrom.qMorphCancel = void 0
  }

  // will be called after Vue catches up with the changes done by _options.onToggle() function
  const calculateFinalState = () => {
    const elTo = getElement(elements.to)
    if (cancelStatus === true || isValidElement(elTo) !== true) {
      typeof elFrom.qMorphCancel === 'function' && elFrom.qMorphCancel()

      return
    }
    // we clean other morphs running on this element
    elFrom !== elTo && typeof elTo.qMorphCancel === 'function' && elTo.qMorphCancel()

    // we hide the final element and the clone of the initial element
    // we don't hide the final element if we want both it and the animated one visible
    options.keepToClone !== true && elTo.classList.add('q-morph--internal')
    elFromClone.classList.add('q-morph--internal')

    // we get the dimensions of the parent of the initial element after changes
    // the difference is how much we should animate the clone
    const {
      width: elFromParentWidthAfter,
      height: elFromParentHeightAfter
    } = getAbsoluteSize(elFromParent)

    // we get the dimensions of the parent of the final element before changes
    const {
      width: elToParentWidthBefore,
      height: elToParentHeightBefore
    } = getAbsoluteSize(elTo.parentNode)

    // then we show the clone of the initial element if we don't want it hidden
    options.hideFromClone !== true && elFromClone.classList.remove('q-morph--internal')

    // we mark the element with its cleanup function
    elTo.qMorphCancel = () => {
      cancelStatus = true

      // we clean the clone of the initial element
      elFromClone.remove()
      elFromTween !== void 0 && elFromTween.remove()

      options.hideFromClone === true && elFromClone.classList.remove('q-morph--internal')

      // we show the final element
      options.keepToClone !== true && elTo.classList.remove('q-morph--internal')

      // we remove the cleanup function from the elements
      elFrom.qMorphCancel = void 0
      elTo.qMorphCancel = void 0
    }

    // will be called after waitFor (give time to render the final element)
    const animate = () => {
      if (cancelStatus === true) {
        typeof elTo.qMorphCancel === 'function' && elTo.qMorphCancel()

        return
      }

      // now the animation starts, so we only need the clone
      // of the initial element as a spacer
      // we also hide it to calculate the dimensions of the
      // parent of the final element after the changes
      if (options.hideFromClone !== true) {
        elFromClone.classList.add('q-morph--internal')
        elFromClone.innerHTML = ''
        elFromClone.style.left = 0
        elFromClone.style.right = 'unset'
        elFromClone.style.top = 0
        elFromClone.style.bottom = 'unset'
        elFromClone.style.transform = 'none'
      }

      // we show the final element
      if (options.keepToClone !== true) {
        elTo.classList.remove('q-morph--internal')
      }

      // we get the dimensions of the parent of the final element after changes
      // the difference is how much we should animate the clone
      const elToParent = elTo.parentNode
      const {
        width: elToParentWidthAfter,
        height: elToParentHeightAfter
      } = getAbsoluteSize(elToParent)

      const elToClone = elTo.cloneNode(options.keepToClone)
      elToClone.setAttribute('aria-hidden', 'true')
      if (options.keepToClone !== true) {
        elToClone.style.left = 0
        elToClone.style.right = 'unset'
        elToClone.style.top = 0
        elToClone.style.bottom = 'unset'
        elToClone.style.transform = 'none'
        elToClone.style.pointerEvents = 'none'
      }
      elToClone.classList.add('q-morph--internal')

      // if elFrom is the same as elTo the next element is elFromClone
      const elToNext = elTo === elFrom && elFromParent === elToParent ? elFromClone : elTo.nextElementSibling
      elToParent.insertBefore(elToClone, elToNext)

      const {
        borderWidth: elToBorderWidth,
        borderStyle: elToBorderStyle,
        borderColor: elToBorderColor,
        borderRadius: elToBorderRadius,
        backgroundColor: elToBackground,
        transform: elToTransform,
        position: elToPositioningType,
        cssText: elToCssText
      } = getComputedStyle(elTo, [ 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'backgroundColor', 'transform', 'position', 'cssText' ])
      const elToClassSaved = elTo.classList.toString()
      const elToStyleSaved = elTo.style.cssText

      // we set the computed styles on the element (to be able to remove classes)
      elTo.style.cssText = elToCssText
      elTo.style.transform = 'none'
      elTo.style.animation = 'none'
      elTo.style.transition = 'none'
      // we strip the background classes (background color can no longer be animated if !important is used)
      elTo.className = elToClassSaved.split(' ').filter(c => /^bg-/.test(c) === false).join(' ')

      const elToPosition = getAbsolutePosition(elTo, options.resize)

      const deltaX = elFromPosition.left - elToPosition.left
      const deltaY = elFromPosition.top - elToPosition.top
      const scaleX = elFromPosition.width / (elToPosition.width > 0 ? elToPosition.width : 10)
      const scaleY = elFromPosition.height / (elToPosition.height > 0 ? elToPosition.height : 100)

      const elFromParentWidthDiff = elFromParentWidthBefore - elFromParentWidthAfter
      const elFromParentHeightDiff = elFromParentHeightBefore - elFromParentHeightAfter
      const elToParentWidthDiff = elToParentWidthAfter - elToParentWidthBefore
      const elToParentHeightDiff = elToParentHeightAfter - elToParentHeightBefore

      const elFromCloneWidth = Math.max(elFromPosition.widthM, elFromParentWidthDiff)
      const elFromCloneHeight = Math.max(elFromPosition.heightM, elFromParentHeightDiff)
      const elToCloneWidth = Math.max(elToPosition.widthM, elToParentWidthDiff)
      const elToCloneHeight = Math.max(elToPosition.heightM, elToParentHeightDiff)

      const elSharedSize = elFrom === elTo &&
        [ 'absolute', 'fixed' ].includes(elToPositioningType) === false &&
        [ 'absolute', 'fixed' ].includes(elFromPositioningType) === false

      // if the final element has fixed position or if a parent
      // has fixed position we need to animate it as fixed
      let elToNeedsFixedPosition = elToPositioningType === 'fixed'
      let parent = elToParent
      while (elToNeedsFixedPosition !== true && parent !== document) {
        elToNeedsFixedPosition = window.getComputedStyle(parent).position === 'fixed'
        parent = parent.parentNode
      }

      // we show the spacer for the initial element
      if (options.hideFromClone !== true) {
        elFromClone.style.display = 'block'
        elFromClone.style.flex = '0 0 auto'
        elFromClone.style.opacity = 0
        elFromClone.style.minWidth = 'unset'
        elFromClone.style.maxWidth = 'unset'
        elFromClone.style.minHeight = 'unset'
        elFromClone.style.maxHeight = 'unset'
        elFromClone.classList.remove('q-morph--internal')
      }

      // we show the spacer for the final element
      if (options.keepToClone !== true) {
        elToClone.style.display = 'block'
        elToClone.style.flex = '0 0 auto'
        elToClone.style.opacity = 0
        elToClone.style.minWidth = 'unset'
        elToClone.style.maxWidth = 'unset'
        elToClone.style.minHeight = 'unset'
        elToClone.style.maxHeight = 'unset'
      }
      elToClone.classList.remove('q-morph--internal')

      // we apply classes specified by user
      if (typeof options.classes === 'string') {
        elTo.className += ' ' + options.classes
      }

      // we apply styles specified by user
      if (typeof options.style === 'string') {
        elTo.style.cssText += ' ' + options.style
      }
      else if (isObject(options.style) === true) {
        for (const prop in options.style) {
          elTo.style[prop] = options.style[prop]
        }
      }

      const elFromZIndex = getMaxZIndex(elFromClone)
      const elToZIndex = getMaxZIndex(elTo)

      // we position the morphing element
      // if we use fixed position for the final element we need to adjust for scroll
      const documentScroll = elToNeedsFixedPosition === true
        ? document.documentElement
        : { scrollLeft: 0, scrollTop: 0 }
      elTo.style.position = elToNeedsFixedPosition === true ? 'fixed' : 'absolute'
      elTo.style.left = `${elToPosition.left - documentScroll.scrollLeft}px`
      elTo.style.right = 'unset'
      elTo.style.top = `${elToPosition.top - documentScroll.scrollTop}px`
      elTo.style.margin = 0

      if (options.resize === true) {
        elTo.style.minWidth = 'unset'
        elTo.style.maxWidth = 'unset'
        elTo.style.minHeight = 'unset'
        elTo.style.maxHeight = 'unset'
        elTo.style.overflow = 'hidden'
        elTo.style.overflowX = 'hidden'
        elTo.style.overflowY = 'hidden'
      }

      document.body.appendChild(elTo)

      if (elFromTween !== void 0) {
        elFromTween.style.cssText = elFromCssText
        elFromTween.style.transform = 'none'
        elFromTween.style.animation = 'none'
        elFromTween.style.transition = 'none'

        elFromTween.style.position = elTo.style.position
        elFromTween.style.left = `${elFromPosition.left - documentScroll.scrollLeft}px`
        elFromTween.style.right = 'unset'
        elFromTween.style.top = `${elFromPosition.top - documentScroll.scrollTop}px`
        elFromTween.style.margin = 0
        elFromTween.style.pointerEvents = 'none'

        if (options.resize === true) {
          elFromTween.style.minWidth = 'unset'
          elFromTween.style.maxWidth = 'unset'
          elFromTween.style.minHeight = 'unset'
          elFromTween.style.maxHeight = 'unset'
          elFromTween.style.overflow = 'hidden'
          elFromTween.style.overflowX = 'hidden'
          elFromTween.style.overflowY = 'hidden'
        }

        document.body.appendChild(elFromTween)
      }

      const commonCleanup = aborted => {
        // we put the element back in it's place
        // and restore the styles and classes
        if (elFrom === elTo && endElementTo !== true) {
          elTo.style.cssText = elFromStyleSaved
          elTo.className = elFromClassSaved
        }
        else {
          elTo.style.cssText = elToStyleSaved
          elTo.className = elToClassSaved
        }
        elToClone.parentNode === elToParent && elToParent.insertBefore(elTo, elToClone)

        // we clean the spacers
        elFromClone.remove()
        elToClone.remove()
        elFromTween !== void 0 && elFromTween.remove()

        // cancel will be no longer available
        cancel = () => false

        elFrom.qMorphCancel = void 0
        elTo.qMorphCancel = void 0

        // we are ready
        if (typeof options.onEnd === 'function') {
          options.onEnd(endElementTo === true ? 'to' : 'from', aborted === true)
        }
      }

      if (options.useCSS !== true && typeof elTo.animate === 'function') {
        const resizeFrom = options.resize === true
          ? {
            transform: `translate(${deltaX}px, ${deltaY}px)`,
            width: `${elFromCloneWidth}px`,
            height: `${elFromCloneHeight}px`
          }
          : {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
          }
        const resizeTo = options.resize === true
          ? {
            width: `${elToCloneWidth}px`,
            height: `${elToCloneHeight}px`
          }
          : {}
        const resizeFromTween = options.resize === true
          ? {
            width: `${elFromCloneWidth}px`,
            height: `${elFromCloneHeight}px`
          }
          : {}
        const resizeToTween = options.resize === true
          ? {
            transform: `translate(${-1 * deltaX}px, ${-1 * deltaY}px)`,
            width: `${elToCloneWidth}px`,
            height: `${elToCloneHeight}px`
          }
          : {
            transform: `translate(${-1 * deltaX}px, ${-1 * deltaY}px) scale(${1 / scaleX}, ${1 / scaleY})`
          }
        const tweenFrom = elFromTween !== void 0
          ? { opacity: options.tweenToOpacity }
          : { backgroundColor: elFromBackground }
        const tweenTo = elFromTween !== void 0
          ? { opacity: 1 }
          : { backgroundColor: elToBackground }
        animationTo = elTo.animate([
          {
            margin: 0,
            borderWidth: elFromBorderWidth,
            borderStyle: elFromBorderStyle,
            borderColor: elFromBorderColor,
            borderRadius: elFromBorderRadius,
            zIndex: elFromZIndex,
            transformOrigin: '0 0',
            ...resizeFrom,
            ...tweenFrom
          },
          {
            margin: 0,
            borderWidth: elToBorderWidth,
            borderStyle: elToBorderStyle,
            borderColor: elToBorderColor,
            borderRadius: elToBorderRadius,
            zIndex: elToZIndex,
            transformOrigin: '0 0',
            transform: elToTransform,
            ...resizeTo,
            ...tweenTo
          }
        ], {
          duration: options.duration,
          easing: options.easing,
          fill: options.fill,
          delay: options.delay
        })

        animationFromTween = elFromTween === void 0 ? void 0 : elFromTween.animate([
          {
            opacity: options.tweenFromOpacity,
            margin: 0,
            borderWidth: elFromBorderWidth,
            borderStyle: elFromBorderStyle,
            borderColor: elFromBorderColor,
            borderRadius: elFromBorderRadius,
            zIndex: elFromZIndex,
            transformOrigin: '0 0',
            transform: elFromTransform,
            ...resizeFromTween
          },
          {
            opacity: 0,
            margin: 0,
            borderWidth: elToBorderWidth,
            borderStyle: elToBorderStyle,
            borderColor: elToBorderColor,
            borderRadius: elToBorderRadius,
            zIndex: elToZIndex,
            transformOrigin: '0 0',
            ...resizeToTween
          }
        ], {
          duration: options.duration,
          easing: options.easing,
          fill: options.fill,
          delay: options.delay
        })

        animationFromClone = options.hideFromClone === true || elSharedSize === true ? void 0 : elFromClone.animate([
          {
            margin: `${elFromParentHeightDiff < 0 ? elFromParentHeightDiff / 2 : 0}px ${elFromParentWidthDiff < 0 ? elFromParentWidthDiff / 2 : 0}px`,
            width: `${elFromCloneWidth + elFromPosition.marginH}px`,
            height: `${elFromCloneHeight + elFromPosition.marginV}px`
          },
          {
            margin: 0,
            width: 0,
            height: 0
          }
        ], {
          duration: options.duration,
          easing: options.easing,
          fill: options.fill,
          delay: options.delay
        })

        animationToClone = options.keepToClone === true ? void 0 : elToClone.animate([
          elSharedSize === true
            ? {
              margin: `${elFromParentHeightDiff < 0 ? elFromParentHeightDiff / 2 : 0}px ${elFromParentWidthDiff < 0 ? elFromParentWidthDiff / 2 : 0}px`,
              width: `${elFromCloneWidth + elFromPosition.marginH}px`,
              height: `${elFromCloneHeight + elFromPosition.marginV}px`
            }
            : {
              margin: 0,
              width: 0,
              height: 0
            },
          {
            margin: `${elToParentHeightDiff < 0 ? elToParentHeightDiff / 2 : 0}px ${elToParentWidthDiff < 0 ? elToParentWidthDiff / 2 : 0}px`,
            width: `${elToCloneWidth + elToPosition.marginH}px`,
            height: `${elToCloneHeight + elToPosition.marginV}px`
          }
        ], {
          duration: options.duration,
          easing: options.easing,
          fill: options.fill,
          delay: options.delay
        })

        const cleanup = abort => {
          animationFromClone !== void 0 && animationFromClone.cancel()
          animationFromTween !== void 0 && animationFromTween.cancel()
          animationToClone !== void 0 && animationToClone.cancel()
          animationTo.cancel()

          animationTo.removeEventListener('finish', cleanup)
          animationTo.removeEventListener('cancel', cleanup)

          commonCleanup(abort)

          // we clean the animations
          animationFromClone = void 0
          animationFromTween = void 0
          animationToClone = void 0
          animationTo = void 0
        }

        elFrom.qMorphCancel = () => {
          elFrom.qMorphCancel = void 0
          cancelStatus = true
          cleanup()
        }
        elTo.qMorphCancel = () => {
          elTo.qMorphCancel = void 0
          cancelStatus = true
          cleanup()
        }

        animationTo.addEventListener('finish', cleanup)
        animationTo.addEventListener('cancel', cleanup)

        cancel = abort => {
          // we are not in a morph that we can cancel
          if (cancelStatus === true || animationTo === void 0) {
            return false
          }

          if (abort === true) {
            cleanup(true)
            return true
          }

          endElementTo = endElementTo !== true

          animationFromClone !== void 0 && animationFromClone.reverse()
          animationFromTween !== void 0 && animationFromTween.reverse()
          animationToClone !== void 0 && animationToClone.reverse()
          animationTo.reverse()

          return true
        }
      }
      else {
        const qAnimId = `q-morph-anim-${++id}`
        const style = document.createElement('style')
        const resizeFrom = options.resize === true
          ? `
            transform: translate(${deltaX}px, ${deltaY}px);
            width: ${elFromCloneWidth}px;
            height: ${elFromCloneHeight}px;
          `
          : `transform: translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY});`
        const resizeTo = options.resize === true
          ? `
            width: ${elToCloneWidth}px;
            height: ${elToCloneHeight}px;
          `
          : ''
        const resizeFromTween = options.resize === true
          ? `
            width: ${elFromCloneWidth}px;
            height: ${elFromCloneHeight}px;
          `
          : ''
        const resizeToTween = options.resize === true
          ? `
            transform: translate(${-1 * deltaX}px, ${-1 * deltaY}px);
            width: ${elToCloneWidth}px;
            height: ${elToCloneHeight}px;
          `
          : `transform: translate(${-1 * deltaX}px, ${-1 * deltaY}px) scale(${1 / scaleX}, ${1 / scaleY});`
        const tweenFrom = elFromTween !== void 0
          ? `opacity: ${options.tweenToOpacity};`
          : `background-color: ${elFromBackground};`
        const tweenTo = elFromTween !== void 0
          ? 'opacity: 1;'
          : `background-color: ${elToBackground};`
        const keyframesFromTween = elFromTween === void 0
          ? ''
          : `
            @keyframes ${qAnimId}-from-tween {
              0% {
                opacity: ${options.tweenFromOpacity};
                margin: 0;
                border-width: ${elFromBorderWidth};
                border-style: ${elFromBorderStyle};
                border-color: ${elFromBorderColor};
                border-radius: ${elFromBorderRadius};
                z-index: ${elFromZIndex};
                transform-origin: 0 0;
                transform: ${elFromTransform};
                ${resizeFromTween}
              }

              100% {
                opacity: 0;
                margin: 0;
                border-width: ${elToBorderWidth};
                border-style: ${elToBorderStyle};
                border-color: ${elToBorderColor};
                border-radius: ${elToBorderRadius};
                z-index: ${elToZIndex};
                transform-origin: 0 0;
                ${resizeToTween}
              }
            }
          `
        const keyframesFrom = options.hideFromClone === true || elSharedSize === true
          ? ''
          : `
            @keyframes ${qAnimId}-from {
              0% {
                margin: ${elFromParentHeightDiff < 0 ? elFromParentHeightDiff / 2 : 0}px ${elFromParentWidthDiff < 0 ? elFromParentWidthDiff / 2 : 0}px;
                width: ${elFromCloneWidth + elFromPosition.marginH}px;
                height: ${elFromCloneHeight + elFromPosition.marginV}px;
              }

              100% {
                margin: 0;
                width: 0;
                height: 0;
              }
            }
          `
        const keyframeToStart = elSharedSize === true
          ? `
            margin: ${elFromParentHeightDiff < 0 ? elFromParentHeightDiff / 2 : 0}px ${elFromParentWidthDiff < 0 ? elFromParentWidthDiff / 2 : 0}px;
            width: ${elFromCloneWidth + elFromPosition.marginH}px;
            height: ${elFromCloneHeight + elFromPosition.marginV}px;
          `
          : `
            margin: 0;
            width: 0;
            height: 0;
          `
        const keyframesTo = options.keepToClone === true
          ? ''
          : `
            @keyframes ${qAnimId}-to {
              0% {
                ${keyframeToStart}
              }

              100% {
                margin: ${elToParentHeightDiff < 0 ? elToParentHeightDiff / 2 : 0}px ${elToParentWidthDiff < 0 ? elToParentWidthDiff / 2 : 0}px;
                width: ${elToCloneWidth + elToPosition.marginH}px;
                height: ${elToCloneHeight + elToPosition.marginV}px;
              }
            }
          `
        style.innerHTML = `
          @keyframes ${qAnimId} {
            0% {
              margin: 0;
              border-width: ${elFromBorderWidth};
              border-style: ${elFromBorderStyle};
              border-color: ${elFromBorderColor};
              border-radius: ${elFromBorderRadius};
              background-color: ${elFromBackground};
              z-index: ${elFromZIndex};
              transform-origin: 0 0;
              ${resizeFrom}
              ${tweenFrom}
            }

            100% {
              margin: 0;
              border-width: ${elToBorderWidth};
              border-style: ${elToBorderStyle};
              border-color: ${elToBorderColor};
              border-radius: ${elToBorderRadius};
              background-color: ${elToBackground};
              z-index: ${elToZIndex};
              transform-origin: 0 0;
              transform: ${elToTransform};
              ${resizeTo}
              ${tweenTo}
            }
          }

          ${keyframesFrom}

          ${keyframesFromTween}

          ${keyframesTo}
        `
        document.head.appendChild(style)

        let animationDirection = 'normal'

        elFromClone.style.animation = `${options.duration}ms ${options.easing} ${options.delay}ms ${animationDirection} ${options.fill} ${qAnimId}-from`
        if (elFromTween !== void 0) {
          elFromTween.style.animation = `${options.duration}ms ${options.easing} ${options.delay}ms ${animationDirection} ${options.fill} ${qAnimId}-from-tween`
        }
        elToClone.style.animation = `${options.duration}ms ${options.easing} ${options.delay}ms ${animationDirection} ${options.fill} ${qAnimId}-to`
        elTo.style.animation = `${options.duration}ms ${options.easing} ${options.delay}ms ${animationDirection} ${options.fill} ${qAnimId}`

        const cleanup = evt => {
          if (evt === Object(evt) && evt.animationName !== qAnimId) {
            return
          }

          elTo.removeEventListener('animationend', cleanup)
          elTo.removeEventListener('animationcancel', cleanup)

          commonCleanup()

          // we clean the animations
          style.remove()
        }

        elFrom.qMorphCancel = () => {
          elFrom.qMorphCancel = void 0
          cancelStatus = true
          cleanup()
        }
        elTo.qMorphCancel = () => {
          elTo.qMorphCancel = void 0
          cancelStatus = true
          cleanup()
        }

        elTo.addEventListener('animationend', cleanup)
        elTo.addEventListener('animationcancel', cleanup)

        cancel = abort => {
          // we are not in a morph that we can cancel
          if (cancelStatus === true || !elTo || !elFromClone || !elToClone) {
            return false
          }

          if (abort === true) {
            cleanup()

            return true
          }

          endElementTo = endElementTo !== true

          animationDirection = animationDirection === 'normal' ? 'reverse' : 'normal'

          elFromClone.style.animationDirection = animationDirection
          elFromTween.style.animationDirection = animationDirection
          elToClone.style.animationDirection = animationDirection
          elTo.style.animationDirection = animationDirection

          return true
        }
      }
    }

    if (
      options.waitFor > 0 ||
      options.waitFor === 'transitionend' ||
      (options.waitFor === Object(options.waitFor) && typeof options.waitFor.then === 'function')
    ) {
      const delayPromise = options.waitFor > 0
        ? new Promise(resolve => setTimeout(resolve, options.waitFor))
        : (
          options.waitFor === 'transitionend'
            ? new Promise(resolve => {
              const timer = setTimeout(() => {
                endFn()
              }, 400)

              const endFn = ev => {
                clearTimeout(timer)

                if (elTo) {
                  elTo.removeEventListener('transitionend', endFn)
                  elTo.removeEventListener('transitioncancel', endFn)
                }

                resolve()
              }

              elTo.addEventListener('transitionend', endFn)
              elTo.addEventListener('transitioncancel', endFn)
            })
            : options.waitFor
        )

      delayPromise
        .then(animate)
        .catch(() => {
          typeof elTo.qMorphCancel === 'function' && elTo.qMorphCancel()
        })
    }
    else {
      animate()
    }
  }

  typeof _options.onToggle === 'function' && _options.onToggle()
  requestAnimationFrame(calculateFinalState)

  // we return the cancel function
  // returns:
  //   false if the cancel cannot be performed (the morph ended already or has not started)
  //   true else
  return abort => cancel(abort)
}
