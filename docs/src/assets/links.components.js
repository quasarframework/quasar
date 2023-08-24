
const components = [
  { name: 'Ajax-bar', short: 'ajaxbar', description: 'A loading bar for ajax calls in progress', tag: 'loading' },
  { name: 'Avatar', description: 'A space for your portrait, icon or text', tag: 'media' },
  { name: 'Badge', description: 'To highlight small but important info', tag: 'media' },
  { name: 'Banner', description: 'To display important messages and actions', tag: 'panel' },
  { name: 'Bar', description: 'A small top bar for side info and actions', tag: 'other' },
  { name: 'Breadcrumbs', description: 'To keep track of your position inside app', tag: 'navigation' },
  { name: 'Buttons', short: 'btn', description: 'To access the most important actions', tag: 'button', path: 'button' },
  { name: 'Buttons Dropdown', short: 'btndropdown', description: 'To access more actions at once in less space', tag: 'button', path: 'button-dropdown' },
  { name: 'Buttons Group', short: 'qbtngroup', description: 'An alternative to classic buttons', tag: 'button', path: 'button-group' },
  { name: 'Cards', description: 'To display grouped contents', tag: 'panel', path: 'card' },
  { name: 'Carousels', description: 'To display images and other contents', tag: 'media', path: 'carousel' },
  { name: 'Chat Message', description: 'To display users\' conversations', tag: 'other', path: 'chat' },
  { name: 'Checkbox', description: 'To flag one or more options in a list', tag: 'input' },
  { name: 'Chips', description: 'A small container for info and actions', tag: 'media', path: 'chip' },
  { name: 'Circular Progress', description: 'To inform when content is still loading', tag: 'loading' },
  { name: 'Color Pickers', description: 'To select color values and codes', tag: 'input', path: 'color-picker' },
  { name: 'Date Picker', description: 'To access the most important actions', tag: 'input', path: 'date' },
  { name: 'Dialogs', description: 'To show actions and info only when needed', tag: 'panel', path: 'dialog' },
  { name: 'Editor WYSIWYG', description: 'To write text and style it directly', tag: 'other', path: 'editor' },
  { name: 'Expansion Panels', short: 'expansionitem', description: 'To show hidden extra info and actions', tag: 'panel', path: 'expansion-item' },
  { name: 'File Pickers', description: 'To access and choose a file from users\' device', tag: 'media', path: 'file-picker' },
  { name: 'Floating Action Button', short: 'fab', description: 'To display the page primary action', tag: 'button' },
  { name: 'Forms', description: 'A system to submit validated inputs', tag: 'input', path: 'form' },
  { name: 'Form Fields', description: 'Wrapper for your own custom form elements', tag: 'input', path: 'field' },
  { name: 'Icon', description: 'To insert icons inside other components', tag: 'media' },
  { name: 'Img', short: 'image', description: 'To set some basic image features', tag: 'media' },
  { name: 'Infinite Scroll', description: 'To enable new content display while scrolling', tag: 'scroll' },
  { name: 'Inner Loading', description: 'To add content loading inside a component', tag: 'loading' },
  { name: 'Input Text Fields', description: 'To collect users\' typed text input', tag: 'input', path: 'input' },
  { name: 'Intersection', description: 'Set how UI elements enter the screen', tag: 'loading' },
  { name: 'Knob', description: 'To set a value with a draggable gauge', tag: 'input' },
  { name: 'Linear Progress', description: 'A loading bar with various behaviors', tag: 'loading' },
  { name: 'List and List Items', description: 'To display contents on a vertical list', tag: 'other' },
  { name: 'Markup Table', description: 'To display data and content on a table', tag: 'table' },
  { name: 'Menu', description: 'A dropdown panel to access options', tag: 'panel' },
  { name: 'No SSR', description: 'Ignore irrelevant code during SSR generation', tag: 'other' },
  { name: 'Observer resize', description: 'Emit an Event when an element resizes', tag: 'other', path: 'resize-observer' },
  { name: 'Observer scroll', description: 'Emit an Event when the user scrolls', tag: 'other', path: 'scroll-observer' },
  { name: 'Option Group', description: 'Helper component to set groups of options', tag: 'input' },
  { name: 'Pagination', description: 'To navigate content on multiple pages', tag: ['navigation'] },
  { name: 'Parallax', description: 'To create interesting UI image background', tag: 'media' },
  { name: 'Popup Edit', description: 'To access inline editing of data', tag: 'input' },
  { name: 'Popup Proxy', description: 'To show extra content on click', tag: 'panel' },
  { name: 'Pull to Refresh', description: 'To refresh the page content with a gesture', tag: 'loading' },
  { name: 'Radio', description: 'To select a single option in a list', tag: 'input' },
  { name: 'Range', description: 'To pick a period on a range of values', tag: 'input' },
  { name: 'Rating', description: 'The classic "star rating" component', tag: 'other' },
  { name: 'Responsive', description: 'To keep content aspect ratio consistent', tag: 'other' },
  { name: 'Scroll Area', description: 'To set a scrollable content in components', tag: 'scroll' },
  { name: 'Select', description: 'To choose one item from a dropdown list', tag: 'input' },
  { name: 'Separator', description: 'The linear visual divider for contents', tag: 'other' },
  { name: 'Skeleton', description: 'To set loading content placeholders', tag: 'loading' },
  { name: 'Slide Item', description: 'To add dragging feature to list items', tag: 'other' },
  { name: 'Slider', description: 'To pick a single value on a range', tag: 'input' },
  { name: 'Slide Transition', description: 'To show a hidden content', tag: 'other' },
  { name: 'Space', description: 'Fill space inside elements using flexbox', tag: 'other' },
  { name: 'Spinners', description: 'A loading indicator with various behaviors', tag: 'loading' },
  { name: 'Splitter', description: 'To add a draggable resizer for containers', tag: 'other' },
  { name: 'Stepper', description: 'To divide content in progressive steps', tag: 'navigation' },
  { name: 'Table', description: 'To display much data on a datatable', tag: 'table' },
  { name: 'Tab Panels', description: 'To split out content view in the same page', tag: 'navigation' },
  { name: 'Tabs', description: 'To navigate separate content in one page', tag: 'navigation' },
  { name: 'Timeline', description: 'A vertical solution to set milestones in time', tag: 'other' },
  { name: 'Time Picker', description: 'To set a specific time on the clock', tag: 'input', path: 'time' },
  { name: 'Toggle Buttons', short: 'btntoggle', description: 'An alternative to pick an option among many', tag: 'button', path: 'button-toggle' },
  { name: 'Toggle', description: 'To switch an option on and off', tag: 'button' },
  { name: 'Toolbar', description: 'The top main bar for actions and menu', tag: 'navigation' },
  { name: 'Tooltip', description: 'To show extra useful info about the UI', tag: 'media' },
  { name: 'Tree', description: 'An indented structure for hierarchical data', tag: 'navigation' },
  { name: 'Uploader', description: 'To upload any kind of file from the computer', tag: 'media' },
  { name: 'Video', description: 'To embed and display a video player in UI', tag: 'media' },
  { name: 'Virtual Scroll', description: 'To render new content while scrolling it', tag: 'scroll' }
]

const directives = [
  { name: 'Intersection', description: 'Handle elements coming into the view', tag: 'directive' },
  { name: 'Material Ripples', description: 'Apply Material ripples to elements', tag: 'directive' },
  { name: 'Mutation', description: 'Watch changes being made to the DOM tree', tag: 'directive' },
  { name: 'Morph', description: 'Morph DOM elements between two states', tag: 'directive' },
  { name: 'Scroll', description: 'Handle page scroll', tag: 'directive' },
  { name: 'Scroll Fire', description: 'Take action when element comes into view', tag: 'directive' },
  { name: 'Touch Hold', description: 'Handle touch & mouse hold user actions', tag: 'directive' },
  { name: 'Touch Pan', description: 'Handle touch & mouse panning user actions', tag: 'directive' },
  { name: 'Touch Repeat', description: 'Handle repeated touch & mouse taps/clicks', tag: 'directive' },
  { name: 'Touch Swipe', description: 'Handle touch & mouse swipe user actions', tag: 'directive' }
]

const plugins = [
  { name: 'Addressbar Color', description: 'Manage the browser addressbar color', tag: 'plugin' },
  { name: 'App Fullscreen', description: 'Handle app fullscreen mode', tag: 'plugin' },
  { name: 'App Visibility', description: 'For app coming into (or out of) view', tag: 'plugin' },
  { name: 'Bottom Sheet', description: 'Quick way to offer a list of actions', tag: 'plugin' },
  { name: 'Cookies', description: 'Easy way to manage browser cookies', tag: 'plugin' },
  { name: 'Dark Mode', description: 'Manage dark mode', tag: 'plugin', path: 'dark' },
  { name: 'Dialog', description: 'Plugin to display a floating modal', tag: 'plugin' },
  { name: 'Loading', description: 'Overlay for a background action in progress', tag: 'plugin' },
  { name: 'Loading Bar', description: 'Display a loading bar for in progress Ajax calls', tag: 'plugin' },
  { name: 'Local/Session Storage', description: 'Manage the local storage and session storage', tag: 'plugin', path: 'web-storage' },
  { name: 'Meta Plugin', description: 'Helps with SEO by managing the meta tags', tag: 'plugin', path: 'meta' },
  { name: 'Notify', description: 'Display floating animated messages', tag: 'plugin' }
]

const utils = [
  { name: 'Date utils', description: 'Easily handle date objects', tag: 'util' },
  { name: 'DOM utils', description: 'Various DOM-related helper utils', tag: 'util' },
  { name: 'Morph utils', description: 'Morph DOM elements helper util', tag: 'util' },
  { name: 'Formatter utils', description: 'Various text formatting utils', tag: 'util' },
  { name: 'Scrolling utils', description: 'Various scrolling-related utils', tag: 'util' },
  { name: 'Type checking utils', description: 'Helpers to determine variable types', tag: 'util' },
  { name: 'Event bus util', description: 'Global event bus', tag: 'util' },
  { name: 'Other utils', description: 'Various other utils that Quasar supplies', tag: 'util' }
]

const componentNameToKebabCase = componentName => componentName.replaceAll(' ', '-').toLowerCase()

export const quasarElements = [
  ...components.map(entry => {
    const kebab = componentNameToKebabCase(entry.name)
    return {
      ...entry,
      img: `https://cdn.quasar.dev/img/components/${ kebab }.jpg`,
      to: `/vue-components/${ entry.path || kebab }`
    }
  }),

  ...directives.map(entry => ({
    ...entry,
    to: `/vue-directives/${ entry.path || componentNameToKebabCase(entry.name) }`
  })),

  ...plugins.map(entry => ({
    ...entry,
    to: `/quasar-plugins/${ entry.path || componentNameToKebabCase(entry.name) }`
  })),

  ...utils.map(entry => ({
    ...entry,
    to: `/quasar-utils/${ componentNameToKebabCase(entry.name) }`
  }))
].map((entry, key) => {
  return {
    key,
    name: entry.name,
    description: entry.description,
    tag: entry.tag,
    img: entry.img,
    haystack: `${ entry.name } ${ entry.description } ${ entry.short || '' }`.toLowerCase(),
    to: entry.to
  }
})
