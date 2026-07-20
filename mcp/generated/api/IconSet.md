# IconSet API

Type: plugin

Canonical documentation: https://quasar.dev/options/quasar-icon-sets

## Props

### `props`

Type: `Object`

Required: yes

Contents (icons) of the Quasar icon set

### `iconMapFn`

Type: `Function | null`

Function to map icon names to other icon names; It is designed to be used internally by Quasar only; Only assign a function to it, but do not call it yourself

Examples:

- `iconName => (myIcons[ iconName ] !== void 0? { icon: myIcons[ iconName ] } : void 0)`

## Methods

### `set`

Set another Quasar Icon Set
