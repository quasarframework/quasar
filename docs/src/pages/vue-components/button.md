---
title: Button
---
Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect baked in (which can be disabled).

The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.

When not disabled or spinning, QBtn emits a `@click` event, as soon as it is clicked or tapped.

## Installation
<doc-installation components="QBtn" />

## Usage
<doc-example title="Standard Button" file="QBtn/Standard" />

<doc-example title="Custom Colors" file="QBtn/CustomColor" />

<doc-example title="With Icons" file="QBtn/WithIcons" />

<doc-example title="Round Buttons" file="QBtn/Round" />

### Design

<doc-example title="Button Design" file="QBtn/ButtonDesign" />

<doc-example title="Button Alignment" file="QBtn/ButtonAlignment" />

<doc-example title="Button Size" file="QBtn/ButtonSize" />

### Progress Related

Some button actions involve contacting a server, so an asynchronous response. It’s best that you inform the user about a background process taking place until the asynchronous response is ready. QBtn offers this possibility through the `loading` prop. This property will display a QSpinner (by default) instead of the icon and/or label of the button. Custom loading content can also be used (not only text or spinners).

<doc-example title="Indeterminate Progress" file="QBtn/IndeterminateProgress" />

Should you wish, you can also display a deterministic progress within the button by using the additional `percentage` property along with what you’ve already learned about buttons with progress:

<doc-example title="Deterministic Progress" file="QBtn/DeterministicProgress" />

### More Options

<doc-example title="Custom Ripple" file="QBtn/CustomRipple" />

<doc-example title="Links" file="QBtn/Links" />

<doc-example title="Other Options" file="QBtn/OtherOptions" />

<doc-example title="Disable" file="QBtn/Disabled" />

### Controlling the Button for Form Submission
When you have a button to submit a form's input to the server, like a "Save" button, more often than not you will also want to give the user the ability to submit the form with a press of the ENTER key. If you would also like to give the user feedback of the saving process being in progress, and to prevent the user repeatedly pressing the button, you would need the button to show a loading spinner and be disabled from click events. QBtn allows this behavior if configured so.

<doc-example title="Form Submission" file="QBtn/FormSubmission" />

## API
<doc-api file="QBtn" />
