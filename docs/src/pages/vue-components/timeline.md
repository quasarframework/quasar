---
title: Timeline
desc: The QTimeline Vue component displays a list of events in chronological order. It is typically a graphic design showing a long bar labelled with dates alongside itself and usually events.
keys: QTimeline,QTimelineEntry
examples: QTimeline
---

The QTimeline component displays a list of events in chronological order. It is typically a graphic design showing a long bar labelled with dates alongside itself and usually events. Timelines can use any time scale, depending on the subject and data.

QTimeline has 3 layouts:

* `dense` (default) is showing headings, titles, subtitles and content on the **timeline-specified side** of the time line (default on right)
* `comfortable` is showing headings, titles and content on the **timeline-specified side** of the time line (default on right) and the subtitles on the other side
* `loose` is showing headings on center, titles and content on the **entry-specified side** of the time line (default on right) and the subtitles on the other side

<doc-api file="QTimeline" />

<doc-api file="QTimelineEntry" />

## Usage

### Basic

<doc-example title="Basic" file="Basic" scrollable />

### Using props only

Below is the same example, but using QTimelineEntry properties only instead of the default slot:

<doc-example title="Props only" file="PropsOnly" scrollable />

### Using slots only

Below is again the same example, but using only QTimelineEntry slots:

<doc-example title="Slots only" file="SlotsOnly" scrollable />

### Dark design

<doc-example title="Force dark mode" file="Dark" scrollable />

### Layouts and side selection

::: warning
QTimelineEntry only takes into account its `side` prop if QTimeline has the `loose` layout.
:::

<doc-example title="Layouts and side selection" file="Layouts" scrollable />

### Responsive

::: tip
The examples below uses `$q.screen` to detect changes in window size to see all 3 layouts in action.
:::

<doc-example title="Responsive layout" file="Responsive" scrollable />
