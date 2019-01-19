---
title: Form Validation
---
You can validate input components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

## Usage
<doc-example title="Basic Usage" file="FormValidation/Standard" />

## Embedded rules
`date`,
`time`,
`fulltime`,
`timeOrFulltime`,
`hexColor`,
`hexaColor`,
`hexOrHexaColor`,
`rgbColor`,
`rgbaColor`,
`rgbOrRgbaColor`,
`hexOrRgbColor`,
`hexaOrRgbaColor`,
`anyColor`,
