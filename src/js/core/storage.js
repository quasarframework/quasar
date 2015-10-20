function encode(value) {
  if (_.isDate(value)) {
    return '__q_date|' + value.toUTCString();
  }
  if (_.isRegExp(value)) {
    return '__q_expr|' + value.source;
  }
  if (_.isNumber(value)) {
    return '__q_numb|' + value;
  }
  if (_.isBoolean(value)) {
    return '__q_bool|' + (value ? '1' : '0');
  }
  if (_.isString(value)) {
    return '__q_strn|' + value;
  }
  if (_.isPlainObject(value)) {
    return '__q_objt|' + JSON.stringify(value);
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value;
}

function decode(value) {
  var type, length, source;

  length = value.length;
  if (length < 10) {
    // then it wasn't encoded by us
    return value;
  }

  type = value.substr(0, 8);
  source = value.substring(9);

  switch(type) {
  case '__q_date':
    return new Date(source);

  case '__q_expr':
    return new RegExp(source);

  case '__q_numb':
    return Number(source);

  case '__q_bool':
    return Boolean(source == '1');

  case '__q_strn':
    return '' + source;

  case '__q_objt':
    return JSON.parse(source);

  default:
    // hmm, we reached here, we don't know the type,
    // then it means it wasn't encoded by us, so just
    // return whatever value it is
    return value;
  }
}

/*
 * Has
 */

function hasLocalStorageItem(key) {
  return window.localStorage.getItem(key) !== null;
}

function hasSessionStorageItem(key) {
  return window.sessionStorage.getItem(key) !== null;
}

/*
 * Length
 */

function getLocalStorageLength() {
  return window.localStorage.length;
};

function getSessionStorageLength() {
  return window.sessionStorage.length;
}

/*
 * Get Item
 */
function getLocalStorageItem(key) {
  if (hasLocalStorageItem(key)) {
    return decode(window.localStorage.getItem(key));
  }
  return null;
}

function getSessionStorageItem(key) {
  if (hasSessionStorageItem(key)) {
    return decode(window.sessionStorage.getItem(key));
  }
  return null;
}

/*
 * Get Key
 */

function getLocalStorageAtIndex(index) {
  if (index < getLocalStorageLength()) {
    return getLocalStorageItem(window.localStorage.key(index));
  }
}

function getSessionStorageAtIndex(index) {
  if (index < getSessionStorageLength()) {
    return getSessionStorageItem(window.sessionStorage.key(index));
  }
}

/*
 * Get All
 */

function getAllLocalStorage() {
  var
    result = {},
    key;

  for (var i = 0; key = window.localStorage.key(i); i++) {
    result[key] = getLocalStorageItem(key);
  }

  return result;
}

function getAllSessionStorage() {
  var
    result = {},
    key;

  for (var i = 0; key = window.sessionStorage.key(i); i++) {
    result[key] = getSessionStorageItem(key);
  }

  return result;
}

/*
 * Set Item
 */

function setLocalStorageItem(key, value) {
  window.localStorage.setItem(key, encode(value));
}

function setSessionStorageItem(key, value) {
  window.sessionStorage.setItem(key, encode(value));
}

/*
 * Remove Item
 */

function removeLocalStorageItem(key) {
  window.localStorage.removeItem(key);
}

function removeSessionStorageItem(key) {
  window.sessionStorage.removeItem(key);
}

/*
 * Clear
 */

function clearLocalStorage() {
  window.localStorage.clear();
}

function clearSessionStorage() {
  window.sessionStorage.clear();
}

/*
 * Is empty?
 */

function localStorageIsEmpty() {
  return getLocalStorageLength() === 0;
}

function sessionStorageIsEmpty() {
  return getSessionStorageLength() === 0;
}


module.exports = {
  has: {
    local: {
      storage: {
        item: hasLocalStorageItem
      }
    },
    session: {
      storage: {
        item: hasSessionStorageItem
      }
    }
  },
  get: {
    all: {
      local: {
        storage: getAllLocalStorage
      },
      session: {
        storage: getAllSessionStorage
      }
    },
    local: {
      storage: {
        length: getLocalStorageLength,
        item: getLocalStorageItem,
        at: {
          index: getLocalStorageAtIndex
        }
      }
    },
    session: {
      storage: {
        length: getSessionStorageLength,
        item: getSessionStorageItem,
        at: {
          index: getSessionStorageAtIndex
        }
      }
    }
  },
  set: {
    local: {
      storage: {
        item: setLocalStorageItem
      }
    },
    session: {
      storage: {
        item: setSessionStorageItem
      }
    }
  },
  remove: {
    local: {
      storage: {
        item: removeLocalStorageItem
      }
    },
    session: {
      storage: {
        item: removeSessionStorageItem
      }
    }
  },
  clear: {
    local: {
      storage: clearLocalStorage
    },
    session: {
      storage: clearSessionStorage
    }
  },
  local: {
    storage: {
      is: {
        empty: localStorageIsEmpty
      }
    }
  },
  session: {
    storage: {
      is: {
        empty: sessionStorageIsEmpty
      }
    }
  }
};
