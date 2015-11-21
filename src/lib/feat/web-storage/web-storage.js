'use strict';

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
    return Boolean(source === '1');

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

function generateFunctions(fn) {
  return {
    local: fn('local'),
    session: fn('session')
  };
}

var hasStorageItem = generateFunctions(function(type) {
  return function(key) {
    return window[type + 'Storage'].getItem(key) !== null;
  };
});

var getStorageLength = generateFunctions(function(type) {
  return function() {
    return window[type + 'Storage'].length;
  };
});

var getStorageItem = generateFunctions(function(type) {
  var
    hasFn = hasStorageItem[type],
    storage = window[type + 'Storage'];

  return function(key) {
    if (hasFn(key)) {
      return decode(storage.getItem(key));
    }
    return null;
  };
});

var getStorageAtIndex = generateFunctions(function(type) {
  var
    lengthFn = getStorageLength[type],
    getItemFn = getStorageItem[type],
    storage = window[type + 'Storage'];

  return function(index) {
    if (index < lengthFn()) {
      return getItemFn(storage.key(index));
    }
  };
});

var getAllStorageItems = generateFunctions(function(type) {
  var
    lengthFn = getStorageLength[type],
    storage = window[type + 'Storage'],
    getItemFn = getStorageItem[type];

  return function() {
    var
      result = {},
      key,
      length = lengthFn();

    for (var i = 0; i < length; i++) {
      key = storage.key(i);
      result[key] = getItemFn(key);
    }

    return result;
  };
});

var setStorageItem = generateFunctions(function(type) {
  var storage = window[type + 'Storage'];

  return function(key, value) {
    storage.setItem(key, encode(value));
  };
});

var removeStorageItem = generateFunctions(function(type) {
  var storage = window[type + 'Storage'];

  return function(key) {
    storage.removeItem(key);
  };
});

var clearStorage = generateFunctions(function(type) {
  var storage = window[type + 'Storage'];

  return function() {
    storage.clear();
  };
});

var storageIsEmpty = generateFunctions(function(type) {
  var getLengthFn = getStorageLength[type];

  return function() {
    return getLengthFn() === 0;
  };
});


_.merge(q, {
  has: {
    local: {
      storage: {
        item: hasStorageItem.local
      }
    },
    session: {
      storage: {
        item: hasStorageItem.session
      }
    }
  },
  get: {
    all: {
      local: {
        storage: {
          items: getAllStorageItems.local
        }
      },
      session: {
        storage: {
          items: getAllStorageItems.session
        }
      }
    },
    local: {
      storage: {
        length: getStorageLength.local,
        item: getStorageItem.local,
        at: {
          index: getStorageAtIndex.local
        }
      }
    },
    session: {
      storage: {
        length: getStorageLength.session,
        item: getStorageItem.session,
        at: {
          index: getStorageAtIndex.session
        }
      }
    }
  },
  set: {
    local: {
      storage: {
        item: setStorageItem.local
      }
    },
    session: {
      storage: {
        item: setStorageItem.session
      }
    }
  },
  remove: {
    local: {
      storage: {
        item: removeStorageItem.local
      }
    },
    session: {
      storage: {
        item: removeStorageItem.session
      }
    }
  },
  clear: {
    local: {
      storage: clearStorage.local
    },
    session: {
      storage: clearStorage.session
    }
  },
  local: {
    storage: {
      is: {
        empty: storageIsEmpty.local
      }
    }
  },
  session: {
    storage: {
      is: {
        empty: storageIsEmpty.session
      }
    }
  }
});
