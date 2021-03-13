---
title: Button
desc: The QBtn Vue component is a button with features like shaping, loading state, ripple and more.
keys: QBtn
related:
  - /vue-components/button-group
  - /vue-components/button-dropdown
  - /vue-components/button-toggle
---
Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect baked in (which can be disabled).

The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.

When not disabled or spinning, QBtn emits a `@click` event, as soon as it is clicked or tapped.

## QBtn API

<doc-api file="QBtn" />

## Usage

### Standard

<doc-example title="Standard buttons" file="QBtn/Standard" />

### Custom colors

<doc-example title="Custom colors" file="QBtn/CustomColor" />

### With icon

<doc-example title="With icon" file="QBtn/WithIcons" />

### Round

<doc-example title="Round buttons" file="QBtn/Round" />

### Custom content

<doc-example title="Custom content" file="QBtn/CustomContent" />

<doc-example title="Truncate label" file="QBtn/TruncateLabel" />

### Design

<doc-example title="Button design" file="QBtn/ButtonDesign" />

### Alignment

<doc-example title="Button alignment" file="QBtn/ButtonAlignment" />

### Size

<doc-example title="Button size" file="QBtn/ButtonSize" />

### Padding

The default padding is "xs md". However, you can use `padding` prop to customize it:

<doc-example title="Button padding" file="QBtn/ButtonPadding" />

### Progress related

Some button actions involve contacting a server, so an asynchronous response. It’s best that you inform the user about a background process taking place until the asynchronous response is ready. QBtn offers this possibility through the `loading` prop. This property will display a QSpinner (by default) instead of the icon and/or label of the button. Custom loading content can also be used (not only text or spinners).

<doc-example title="Indeterminate progress" file="QBtn/IndeterminateProgress" />

Should you wish, you can also display a deterministic progress within the button by using the additional `percentage` property along with what you’ve already learned about buttons with progress:

<doc-example title="Deterministic progress" file="QBtn/DeterministicProgress" />

### Custom ripple

<doc-example title="Custom ripple" file="QBtn/CustomRipple" />

### Handling links

The two examples below won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

<doc-example title="Links" file="QBtn/Links" no-edit />

For more convoluted use-cases, you can also directly use the native Vue `<router-link>` component to wrap a QBtn. This also gives the opportunity to control the state according to app's current route:

<doc-example title="Scoped slot of RouterLink" file="QBtn/RouterLinkExample" no-edit />

### Other options

<doc-example title="Other options" file="QBtn/OtherOptions" />

### Disable

<doc-example title="Disable" file="QBtn/Disabled" />

### Controlling the button for form submission
When you have a button to submit a form's input to the server, like a "Save" button, more often than not you will also want to give the user the ability to submit the form with a press of the ENTER key. If you would also like to give the user feedback of the saving process being in progress, and to prevent the user repeatedly pressing the button, you would need the button to show a loading spinner and be disabled from click events. QBtn allows this behavior if configured so.

::: warning
When placing a QBtn with type "submit" in one of the "before", "after", "prepend", or "append" slots of a QField, QInput or QSelect, you should also add a `@click` listener on the QBtn in question. This listener should call the method that submits your form. All "click" events in such slots are not propagated to their parent elements.
:::

<doc-example title="Form Submission" file="QBtn/FormSubmission" />
