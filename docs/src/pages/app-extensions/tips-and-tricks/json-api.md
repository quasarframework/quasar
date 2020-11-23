---
title: Quasar JSON API Schema
desc: The JSON API used to describe Component App Extensions.
---

This page describes the JSON API Schema used for component App Extensions.

## Benefits of using JSON API

  1. Describes your existing data format(s)
  2. Provides clear human- and machine- readable documentation
  3. Validates data which is useful for:
      - Automated testing
      - Ensuring quality of submitted data

## JSON Data Structures
At its heart, JSON is built on the following data structures:

object:

```json
{ "key1": "value1", "key2": "value2" }
```

array:

```json
[ "first", "second", "third" ]
```

number:

```json
42
3.1415926
```

string:

```json
"This is a string"
```

boolean:

```json
true
false
```

null:

```json
null
```

## Quasar JSON API

The unfilled schema typically looks like this:

```json
{
  "props": {
  },
  "events": {
  },
  "slots": {
  },
  "methods": {
  }
}
```

### General

The first part of a definition is the actual item name itself.

::: tip
If in the `props` section, this should be the forward facing name. Meaning, if your item being described is in camelCase, then the forward facing item name is in kebab-case. ex: `myProp` becomes `my-prop`.
:::

The rest of the definitions can be one of the following:

| Name | Description |
| :--- | :--- |
| type | Optional for everything but `props`. This can be a single item or array of items. Values are: `["Array", "Boolean", "Function", "Number", "Object", "String", "Null", "Any"]` |
| desc | Any string that describes the item being described |
| required | [true,false] |
| values | an array of constrained values. Ex: `[0, 0.5, 1.0, 1.5, 2.0]` |
| definition | Describes an object definition. This is an object that pretty much conforms to the base object. It can contain `"type"`, `"desc"`, `"required"`, `"examples"`, `"values"` and `"definition"` (recursive) |
| params| Typically is used to describe parameters to a function. This needs one or more parameters as the key to an object that pretty much conforms to the base object. It can contain `"type"`, `"desc"`, `"required"`, `"examples"`, `"values"` and `"definition"` (recursive) |
| returns | The returned value (for methods or functions) |
| category | Used for grouping |

All items are optional, but in the very least you should provide a description.

### Props example

```json
  "props": {
    "value": {
      "type": "Boolean",
      "desc": "Model of the component defining if it is shown or hidden to the user; Either use this property (along with a listener for 'input' event) OR use v-model directive",
      "default": true,
      "examples": [
        "v-model=\"footerState\""
      ],
      "category": "model"
    },
    "locale": {
      "type": "Object",
      "desc": "Locale formatting options",
      "examples": [ ":locale=\"{ monthsShort: ['Ian', 'Feb', 'Mar', '...'] }\"" ],
      "definition": {
        "days": {
          "type": "Array",
          "desc": "List of full day names (DDDD), starting with Sunday",
          "examples": [ "['Duminica', 'Luni', 'Marti', '...']" ]
        },
        "daysShort": {
          "type": "Array",
          "desc": "List of short day names (DDD), starting with Sunday",
          "examples": [ "['Dum', 'Lun', 'Mar', '...']" ]
        },
        "months": {
          "type": "Array",
          "desc": "List of full month names (MMMM), starting with January",
          "examples": [ "['Ianuarie', 'Februarie', 'Martie', '...']" ]
        },
        "monthsShort": {
          "type": "Array",
          "desc": "List of short month names (MMM), starting with January",
          "examples": [ "['Ian', 'Feb', 'Mar', '...']" ]
        }
      },
      "category": "model"
    },
    "options": {
      "type": "Function",
      "desc": "Optionally configure what time is the user allowed to set; Overridden by 'hour-options', 'minute-options' and 'second-options' if those are set",
      "params": {
        "hr": {
          "type": "Number",
          "desc": "Hour",
          "examples": [ 15 ]
        },
        "min": {
          "type": "Number",
          "desc": "Minutes",
          "examples": [ 38 ]
        },
        "sec": {
          "type": "Number",
          "desc": "Seconds",
          "examples": [ 12 ]
        }
      },
      "returns": null,
      "examples": [
        ":options=\"(hr, min, sec) => hr <= 6\""
      ],
      "category": "behavior"
    },
    "events": {
      "type": [ "Array", "Function" ],
      "desc": "A list of events to highlight on the calendar; If using a function, it receives the date as a String and must return a Boolean (matches or not)",
      "examples": [
        ":events=\"['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']\"",
        ":events=\"date => date[9] % 3 === 0\""
      ],
      "category": "model"
    }
  }
```


### Events example

```json
  "events": {
    "show": {
      "desc": "Emitted after component has triggered show()",
      "params": {
        "evt": {
          "type": "Object",
          "desc": "JS event object",
          "required": true
        }
      }
    },
    "input": {
      "params": {
        "value": {
          "type": "String"
        },
        "reason": {
          "type": "String",
          "desc": "Reason of the user interaction (what was picked)",
          "values": [ "year", "month", "day", "today", "locale", "mask" ]
        },
        "details": {
          "type": "Object",
          "desc": "Object of properties on the new model",
          "definition": {
            "year": {
              "type": "Number"
            },
            "month": {
              "type": "Number"
            },
            "day": {
              "type": "Number"
            }
          }
        }
      }
    }
  }
```

### Slots example

```json
  "slots": {
    "default": {
      "desc": "This is where Banner content goes"
    },

    "avatar": {
      "desc": "Slot for displaying an avatar (suggestions: QIcon, QAvatar)"
    },

    "selected-item": {
      "desc": "Override default selection slot; Suggestion: QChip",
      "scope": {
        "index": {
          "type": "Number",
          "desc": "Selection index",
          "examples": [ 0 ]
        },
        "opt": {
          "type": "Any",
          "desc": "Selected option -- its value is taken from model"
        },
        "selected": {
          "type": "Boolean",
          "desc": "Always true -- passed down as prop to QItem (when using QItem)"
        },
        "removeAtIndex": {
          "type": "Function",
          "desc": "Remove selected option located at specific index",
          "params": {
            "index": {
              "type": "Number",
              "desc": "Index at which to remove selection",
              "examples": [ 0 ]
            }
          },
          "returns": null
        },
        "toggleOption": {
          "type": "Function",
          "desc": "Add/remove option from model",
          "params": {
            "opt": {
              "type": "Any",
              "desc": "Option to add to model"
            }
          },
          "returns": null
        },
        "tabindex": {
          "type": "Number",
          "desc": "Tabindex HTML attribute value associated with respective option",
          "values": [ 0, -1 ]
        }
      }
    }
  },
```

### Methods example

```json
  "methods": {
    "focus": {
      "desc": "Focus on first focusable element/component in the form"
    },

    "validate": {
      "desc": "Triggers a validation on all applicable inner Quasar components",
      "params": {
        "shouldFocus": {
          "type": "Boolean",
          "desc": "Tell if it should focus or not on component with error on submitting form; Overrides 'no-focus-error' prop if specified"
        }
      },
      "returns": {
        "type": "Promise<boolean>",
        "desc": "Promise is always fulfilled and receives the outcome (true -> validation was a success, false -> invalid models detected)",
        "examples": [
          "validate().then(outcome => { ... })"
        ]
      }
    }
  }
```
