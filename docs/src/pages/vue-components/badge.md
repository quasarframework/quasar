---
title: Badge
desc: The QBadge Vue component allows you to display information like contextual data that needs to stand out and get noticed.
keys: QBadge
examples: QBadge
---

The QBadge component allows you to create a small badge for adding information like contextual data that needs to stand out and get noticed. It is also often useful in combination with other elements like a user avatar to show a number of new messages.

<DocApi file="QBadge" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="Aligned" file="Align" />

<DocExample title="Floating" file="Floating" />

<DocExample title="Transparent" file="Transparent" />

<DocExample title="Outline design" file="Outline" />

<DocExample title="Rounded" file="Rounded" />

<DocExample title="Indicators" file="Indicators" />

## Accessibility <q-badge label="v2.25+" />

QBadge renders with `role="status"` — a polite live region — and takes its `aria-label` from the `label` prop, so a badge whose label changes after render is announced automatically (content coming through the default slot is read as plain text instead).

A `floating` badge is attached to its host element only visually; there is no programmatic association between the two. Make sure the host's own accessible name carries the badge's meaning — "Inbox, 4 unread" rather than a bare "4" floating next to an unlabeled icon.
