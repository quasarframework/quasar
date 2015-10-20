function encode(value) {
  return _.isObject(value) ? JSON.stringify(value) : value;
}

function decode(value) {
  try {
    value = JSON.parse(value);
  }
  catch(e) {};

  return value;
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
