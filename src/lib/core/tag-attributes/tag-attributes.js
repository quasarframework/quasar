$.fn.getAttributes = function() {
  var attributes = {};

  if (this.length) {
    var self = this[0].attributes;

    Object.keys(self).forEach(function(key) {
      if (self[key].name) {
        attributes[self[key].name] = self[key].value;
      }
    });
  }

  return attributes;
};

function parseParam(list) {
  if (!list) {
    return false;
  }

  if (!Array.isArray(list)) {
    list = list.split(' ');
  }

  return list;
}

function hasAsset(list, fn) {
  list = parseParam(list);

  if (!list) {
    return false;
  }

  return list.some(fn);
}

$.fn.getAttributesManager = function() {
  var
    node = this,
    attributes = this.getAttributes(),
    tag = 'attributes manager: '
    ;

  return {
    has: function(list) {
      return hasAsset(list, function(name) {
        return attributes.hasOwnProperty(name);
      });
    },
    hasEmpty: function(list) {
      var value;

      list = parseParam(list);

      if (!list) {
        return false;
      }

      return list.some(function(name) {
        value = attributes[name];
        return attributes.hasOwnProperty(name) && (typeof value === 'undefined' || value === '');
      });
    },
    hasWithPrefix: function(prefix) {
      return Object.keys(this.getWithPrefix(prefix)).length > 0;
    },
    hasEmptyWithPrefix: function(prefix) {
      return this.getEmptyWithPrefix(prefix).length > 0;
    },

    with: function(list, fn, defaultName) {
      list = parseParam(list);

      if (!list) {
        return this;
      }

      var intersection = list.filter(function(att) {
        return attributes.hasOwnProperty(att);
      });

      if (intersection.length === 0) {
        if (defaultName) {
          fn(defaultName);
        }
        return this; // <<< EARLY EXIT
      }

      if (intersection.length >= 2) {
        throw new Error(tag + 'two or more attrs in list are present');
      }

      var name = intersection[0];

      fn(name, attributes[name]);
      return this.remove(name);
    },
    withEmpty: function(names, fn, defaultName) {
      names = parseParam(names);

      if (!names) {
        return this;
      }

      names = names.filter(function(name) {
        return this.hasEmpty(name);
      }.bind(this));

      return this.with(names, fn, defaultName);
    },

    getAll: function() {
      return $.extend(true, {}, attributes);
    },
    getEmpty: function() {
      var attrs = [];

      Object.keys(attributes).forEach(function(name) {
        if (this.hasEmpty(name)) {
          attrs.push(name);
        }
      }.bind(this));

      return attrs;
    },
    getWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'specify prefix');
      }

      var attrs = {};

      Object.keys(attributes).forEach(function(name) {
        if (name.indexOf(prefix) === 0) {
          attrs[name] = attributes[name];
        }
      });
      return attrs;
    },
    getEmptyWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'specify prefix');
      }

      var attrs = [];

      this.getEmpty().forEach(function(name) {
        if (name.indexOf(prefix) === 0) {
          attrs.push(name);
        }
      });
      return attrs;
    },

    remove: function(list) {
      if (!Array.isArray(list)) {
        list = list ? list.split(' ') : Object.keys(attributes);
      }

      list.forEach(function(name) {
        if (this.has(name)) {
          node.removeAttr(name);
        }
      }.bind(this));

      return this.update();
    },
    removeEmpty: function(list) {
      list = parseParam(list);

      if (!list) {
        return this.remove(this.getEmpty());
      }

      list = list.filter(function(item) {
        return this.hasEmpty(item);
      }.bind(this));

      if (list.length === 0) {
        return this;
      }

      return this.remove(list);
    },
    removeWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'please specify prefix');
      }

      Object.keys(this.getWithPrefix(prefix)).forEach(function(name) {
        node.removeAttr(name);
      });

      return this.update();
    },
    removeEmptyWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'please specify prefix');
      }

      this.getEmptyWithPrefix(prefix).forEach(function(name) {
        node.removeAttr(name);
      });

      return this.update();
    },

    getClass: function() {
      return node.attr('class').split(' ');
    },
    hasClass: function(list) {
      return hasAsset(list, function(name) {
        return node.hasClass(name);
      });
    },
    hasClassWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'specify prefix');
      }

      var classes = node.attr('class');

      if (!classes) {
        return false;
      }

      classes = classes.split(' ').filter(function(c) {
        return c.indexOf(prefix) === 0;
      });
      return classes.length > 0;
    },
    removeClass: function(name) {
      if (Array.isArray(name)) {
        name = name.join(' ');
      }
      node.removeClass(name);
      return this;
    },
    removeClassWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'specify prefix');
      }

      var classes = node.attr('class');

      if (classes) {
        classes = classes.split(' ').filter(function(c) {
          return c.indexOf(prefix) !== 0;
        });
        node.attr('class', $.trim(classes.join(' ')));
        this.update();
      }

      return this;
    },
    addClass: function(list) {
      if (Array.isArray(list)) {
        list = list.join(' ');
      }

      node.addClass(list);
      return this;
    },

    add: function(name, value) {
      if (!name) {
        throw new Error(tag + 'specify attribute name');
      }

      node.attr(name, value || '');
      return this.update();
    },

    update: function() {
      attributes = node.getAttributes();
      return this;
    }
  };
};
