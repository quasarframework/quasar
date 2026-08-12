---
title: Banner
desc: The QBanner Vue component displays a prominent message and related optional actions.
keys: QBanner
examples: QBanner
---

The QBanner component creates a banner element to display a prominent message and related optional actions.

According to the Material Design spec, the banner should be "displayed at the top of the screen, below a top app bar" - but of course you can put one anywhere that makes sense, even in a QDialog.

<DocApi file="QBanner" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="Rounded border" file="Rounded" />

<DocExample title="With an image" file="Image" />

<DocExample title="Inline actions" file="Inline" />

<DocExample title="Dense" file="Dense" />

## Accessibility

QBanner renders with `role="alert"`, an assertive live region: a banner inserted dynamically (say, an error appearing after a failed request) is announced immediately, while one rendered together with the page is not announced at all. For a persistent, informational banner that should not interrupt, override the role by passing an attribute — `role="status"` for polite announcements, or a landmark role such as `region` (with an `aria-label`) for purely static content.
