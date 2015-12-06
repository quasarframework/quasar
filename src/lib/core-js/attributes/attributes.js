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
  var tag = 'attributes manager';

  if (!this.length) {
    return;
  }
  else if (this.length > 1) {
    throw new Error(tag, 'please select only one node');
  }

  var node = this;
  var attributes = this.getAttributes();

  return {
    has: function(name) {
      return attributes.hasOwnProperty(name);
    },
    hasWithPrefix: function(prefix) {
      return this.getWithPrefix(prefix).length > 0;
    },
    hasEmpty: function(name) {
      if (!this.has(name)) { return; }
      var value = attributes[name];

      return _.isUndefined(value) || value === '';
    },
    hasWithEmptyPrefix: function(prefix) {
      return this.getEmptyWithPrefix(prefix).length > 0;
    },
    hasEmptyByList: function(list) {
      var manager = this;

      return _.any(list, function(name) {
        return manager.hasEmpty(name);
      });
    },

    with: function(name, fn) {
      if (!this.has(name)) { return this; }
      fn(name, attributes[name]);
      this.remove(name);
      return this;
    },
    withEmpty: function(name, fn) {
      if (!this.hasEmpty(name)) { return; }
      return this.with(name, fn);
    },
    withByList: function(list, fn, defaultName, doNotUseDefault) {
      var intersection = _.intersection(list, _.keys(attributes));

      if (intersection.length == 0) {
        if (defaultName && !doNotUseDefault) {
          fn(defaultName);
        }
        return this;
      }
      else if (intersection.length >= 2) {
        throw new Error(tag, 'two or more attrs in list are present');
      }

      return this.with(intersection[0], fn);
    },
    withEmptyByList: function(list, fn, defaultName) {
      var manager = this;

      if (_.any(list, function(name) {
        return manager.has(name) && !manager.hasEmpty(name);
      })) {
        throw new Error(tag, 'some of attrs in list are not empty');
      }

      return this.withByList(list, fn, defaultName);
    },

    getAll: function() {
      return _.clone(attributes);
    },
    getEmpty: function() {
      var attrs = [];
      var manager = this;

      _.each(attributes, function(value, name) {
        if (manager.hasEmpty(name)) {
          attrs.push(name);
        }
      });
      return attrs;
    },
    getEmptyWithPrefix: function(prefix) {
      var attrs = [];
      var manager = this;

      _.each(this.getEmpty(), function(name) {
        if (name.startsWith(prefix)) {
          attrs.push(name);
        }
      });
      return attrs;
    },
    getWithPrefix: function(prefix) {
      var attrs = {};
      var manager = this;

      _.each(attributes, function(value, name) {
        if (name.startsWith(prefix)) {
          attrs[name] = value;
        }
      });
      return attrs;
    },

    remove: function(name) {
      if (this.has(name)) {
        node.removeAttr(name);
        this.update();
      }
      return this;
    },
    removeEmpty: function() {
      var manager = this;

      _.map(this.getEmpty(), function(name) {
        manager.remove(name);
      });
      return this.update();
    },
    removeByList: function(list) {
      var manager = this;

      _.each(list, function(name) {
        manager.remove(name);
      });
      return this.update();
    },
    removeEmptyByList: function(list) {
      var manager = this;

      _.each(list, function(name) {
        if (manager.hasEmpty(name)) {
          manager.remove(name);
        }
      });
      return this.update();
    },
    removeWithPrefix: function(prefix) {
      _.each(this.getWithPrefix(prefix), function(name) {
        node.removeAttr(name);
      });
      return this.update();
    },
    hasClassByList: function(list) {
      return _.any(list, function(name) {
        return node.hasClass(name);
      });
    },
    hasClassWithPrefix: function(prefix) {
      var classes = node.attr('class');

      if (!classes) {
        return false;
      }

      classes = classes.split(' ').filter(function(c) {
        return c.lastIndexOf(prefix, 0) !== 0;
      });
      return classes.length > 0;
    },
    removeClass: function(name) {
      node.removeClass(name);
      return this;
    },
    removeClassWithPrefix: function(prefix) {
      var classes;

      if (classes = node.attr('class')) {
        classes = classes.split(' ').filter(function(c) {
          return c.lastIndexOf(prefix, 0) !== 0;
        });
        node.attr('class', $.trim(classes.join(' ')));
        this.update();
      }
      return this;
    },

    add: function(name, value) {
      node.attr(name, value);
      return this;
    },

    update: function() {
      attributes = node.getAttributes();
      return this;
    }
  };
};
