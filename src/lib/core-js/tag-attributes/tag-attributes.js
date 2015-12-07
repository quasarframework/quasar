$.fn.getAttributes = function() {
  var attributes = {};

  if (this.length) {
    $.each(this[0].attributes, function(index, attr) {
      attributes[attr.name] = attr.value;
    });
  }

  return attributes;
};

$.fn.getAttributesManager = function() {
  var
    node = this,
    attributes = this.getAttributes(),
    tag = 'attributes manager: '
    ;

  return {
    has: function(list) {
      if (!list) {
        return false;
      }

      if (!_.isArray(list)) {
        list = list.split(' ');
      }

      return _.any(list, function(name) {
        return attributes.hasOwnProperty(name);
      });
    },
    hasEmpty: function(emptyAttrList) {
      var value;

      if (!emptyAttrList) {
        return false;
      }

      if (!_.isArray(emptyAttrList)) {
        emptyAttrList = emptyAttrList.split(' ');
      }

      return _.any(emptyAttrList, function(name) {
        value = attributes[name];
        return attributes.hasOwnProperty(name) && (_.isUndefined(value) || value === '');
      });
    },
    hasWithPrefix: function(prefix) {
      return !_.isEmpty(this.getWithPrefix(prefix));
    },
    hasEmptyWithPrefix: function(prefix) {
      return !_.isEmpty(this.getEmptyWithPrefix(prefix));
    },

    with: function(list, fn, defaultName, doNotUseDefault) {
      if (!list) {
        return this;
      }

      if (!_.isArray(list)) {
        list = list.split(' ');
      }

      var intersection = _.intersection(list, _.keys(attributes));

      if (intersection.length === 0) {
        if (defaultName && !doNotUseDefault) {
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
    withEmpty: function(names, fn, defaultName, doNotUseDefault) {
      if (!names) {
        return this;
      }

      if (!_.isArray(names)) {
        names = names.split(' ');
      }

      names = _.filter(names, function(name) {
        return this.hasEmpty(name);
      }.bind(this));

      return this.with(names, fn, defaultName, doNotUseDefault);
    },

    getAll: function() {
      return _.clone(attributes);
    },
    getEmpty: function() {
      var attrs = [];

      _.each(attributes, function(value, name) {
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

      _.each(attributes, function(value, name) {
        if (name.indexOf(prefix) === 0) {
          attrs[name] = value;
        }
      });
      return attrs;
    },
    getEmptyWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'specify prefix');
      }

      var attrs = [];

      _.each(this.getEmpty(), function(name) {
        if (name.indexOf(prefix) === 0) {
          attrs.push(name);
        }
      });
      return attrs;
    },

    remove: function(list) {
      if (!_.isArray(list)) {
        list = list ? list.split(' ') : _.keys(attributes);
      }

      _.each(list, function(name) {
        if (this.has(name)) {
          node.removeAttr(name);
        }
      }.bind(this));

      return this.update();
    },
    removeEmpty: function(list) {
      if (!list) {
        return this.remove(this.getEmpty());
      }

      if (!_.isArray(list)) {
        list = list.split(' ');
      }

      list = _.filter(list, function(item) {
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

      _.each(this.getWithPrefix(prefix), function(value, name) {
        node.removeAttr(name);
      });

      return this.update();
    },
    removeEmptyWithPrefix: function(prefix) {
      if (!prefix) {
        throw new Error(tag + 'please specify prefix');
      }

      _.each(this.getEmptyWithPrefix(prefix), function(name) {
        node.removeAttr(name);
      });

      return this.update();
    },

    getClass: function() {
      return node.attr('class').split(' ');
    },
    hasClass: function(classList) {
      if (!classList) {
        return false;
      }

      if (!_.isArray(classList)) {
        classList = classList.split(' ');
      }

      return _.any(classList, function(name) {
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
      if (_.isArray(name)) {
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
      if (_.isArray(list)) {
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
