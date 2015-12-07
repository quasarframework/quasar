'use strict';

describe('Tag Attributes', function() {

  var
    id = 'tag-attrib-test',
    body = $('body')
    ;

  afterEach(function() {
    $(id).remove();
  });

  function inject(attributes) {
    $(id).remove();
    return $('<div id="' + id + '" ' + attributes + '>').appendTo(body);
  }

  it('should be able to get list of all attributes', function() {
    var
      node = inject('one="1" two="2" three four'),
      att = node.getAttributes()
      ;

    expect(att).to.be.an('object');
    expect(att).to.deep.equal({
      id: id,
      one: '1',
      two: '2',
      three: '',
      four: ''
    });
  });

  it('should not throw error when getting list of all attributes on incorrect selector', function() {
    expect($('#bogus-node').getAttributes()).to.deep.equal({});
  });

  it('should be able to get attributes manager', function() {
    var
      node = inject('one="1" two="2" three four'),
      att = node.getAttributesManager()
      ;

    expect(att).to.be.an('object');
    expect(att.has).to.be.a('function');
  });

  it('should not throw error when getting attributes manager on incorrect selector', function() {
    expect($('#bogus-node').getAttributesManager()).to.be.an('object');
  });

  it('has()', function() {
    var
      node = inject('one="1" two'),
      att = node.getAttributesManager()
      ;

    expect(att.has()).to.equal(false);
    expect(att.has('')).to.equal(false);
    expect(att.has('one')).to.equal(true);
    expect(att.has('two')).to.equal(true);
    expect(att.has('bogus')).to.equal(false);
    expect($('.bogus').getAttributesManager().has('my')).to.equal(false);
  });

  it('hasWithPrefix()', function() {
    var
      node = inject('att="yes" myattrib="one" my-other'),
      att = node.getAttributesManager()
      ;

    expect(att.hasWithPrefix('my')).to.equal(true);
    expect(att.hasWithPrefix('bogus')).to.equal(false);
    expect($('.bogus').getAttributesManager().hasWithPrefix('my')).to.equal(false);
  });

  it('hasEmpty()', function() {
    expect(inject('my-other').getAttributesManager().hasEmpty()).to.equal(false);
    expect(inject('my-other').getAttributesManager().hasEmpty('my-other')).to.equal(true);
    expect(inject('my-other="value"').getAttributesManager().hasEmpty('my-other')).to.equal(false);
    expect($('.bogus').getAttributesManager().hasEmpty('my')).to.equal(false);
  });

  it('hasEmptyWithPrefix()', function() {
    expect(inject('my-other').getAttributesManager().hasEmptyWithPrefix('my-other')).to.equal(true);
    expect(inject('my-other="value"').getAttributesManager().hasEmptyWithPrefix('my-other')).to.equal(false);
    expect($('.bogus').getAttributesManager().hasEmptyWithPrefix('my')).to.equal(false);
  });

  it('has with list()', function() {
    expect(inject('my-other').getAttributesManager().has('my-other other')).to.equal(true);
    expect(inject('my-other').getAttributesManager().has(['my-other', 'other'])).to.equal(true);
    expect(inject('my-other my="true"').getAttributesManager().has('my')).to.equal(true);
    expect(inject('my-other').getAttributesManager().has('some-other other')).to.equal(false);
    expect(inject('my-other').getAttributesManager().has(['some-other', 'other'])).to.equal(false);
    expect(inject('my-other="value"').getAttributesManager().has('my-other')).to.equal(true);
    expect($('.bogus').getAttributesManager().has('my other')).to.equal(false);
  });

  it('hasEmpty with list()', function() {
    expect(inject('my-other').getAttributesManager().hasEmpty('my-other other')).to.equal(true);
    expect(inject('my-other').getAttributesManager().hasEmpty(['my-other', 'other'])).to.equal(true);
    expect(inject('my-other').getAttributesManager().hasEmpty('some-other other')).to.equal(false);
    expect(inject('my-other').getAttributesManager().hasEmpty(['some-other', 'other'])).to.equal(false);
    expect(inject('my-other="value"').getAttributesManager().hasEmpty('my-other')).to.equal(false);
    expect($('.bogus').getAttributesManager().hasEmpty('my other')).to.equal(false);
  });

  it('with()', function() {
    var
      node = inject('empty first="1st"'),
      att = node.getAttributesManager()
      ;

    att.with();
    att.with('', function() {
      throw new Error('Should not reach here becasue no attr was specified.');
    });

    att.with('first', function(name, value) {
      expect(name).to.equal('first');
      expect(value).to.equal('1st');
    });
    att.with('empty', function(name, value) {
      expect(name).to.equal('empty');
      expect(value).to.equal('');
    });
    expect(att.has('first')).to.equal(false);
    expect(att.has('empty')).to.equal(false);

    att.with('first', function() {
      throw new Error('should not reach here as attrib does not exist anymore.');
    });

    expect(att.with('first', $.noop)).to.equal(att);
  });

  it('withEmpty', function() {
    var
      node = inject('first="1st" second'),
      att = node.getAttributesManager()
      ;

    att.withEmpty();
    att.withEmpty('', function() {
      throw new Error('Should not reach here becasue no attr was specified.');
    });

    att.withEmpty('first', function() {
      throw new Error('Should not reach here as attrib is not empty');
    });
    att.withEmpty('second', function(name, value) {
      expect(name).to.equal('second');
      expect(value).to.equal('');
    });
    expect(att.has('first')).to.equal(true);
    expect(att.has('second')).to.equal(false);

    att.withEmpty('first', function() {
      throw new Error('should not reach here as attrib does not exist anymore.');
    });

    expect(att.withEmpty('first', $.noop)).to.equal(att);
  });

  it('with() with list', function() {
    var
      node = inject('first="1st" second="2nd" third'),
      att = node.getAttributesManager(),
      result
      ;

    result = att.with('one two', function() {
      throw new Error('Should not reach here as list is not valid');
    });
    expect(result).to.equal(att);

    expect(function() {
      att.with('first second', $.noop);
    }).to.throw();

    expect(function() {
      att.with('first third');
    }).to.throw(/two or more attrs in list are present/);

    result = att.with('first fourth', function(defaultName) {
      expect(defaultName).to.equal('first');
    }, 'defaultName');
    expect(result).to.equal(att);
    expect(att.has('first')).to.equal(false);

    result = att.with('fourth fifth', function(defaultName) {
      expect(defaultName).to.equal('defaultName');
    }, 'defaultName');
    expect(result).to.equal(att);

    result = att.with('fourth fifth', function() {
      throw new Error('Should not reach here as list is not valid');
    }, 'defaultName', true);
    expect(result).to.equal(att);
  });

  it('withEmpty() with list', function() {
    var
      node = inject('one two first="1st" second="2nd" tag'),
      att = node.getAttributesManager(),
      result
      ;

    result = att.withEmpty('bogus1 bogus2', function() {
      throw new Error('Should not reach here as list is not valid');
    });
    expect(result).to.equal(att);

    att.withEmpty('first second bogus', function() {
      throw new Error('Should not reach here as no attrs are present and empty');
    });

    expect(function() {
      att.withEmpty('one two');
    }).to.throw(/two or more attrs in list are present/);

    att.withEmpty(['bogus', 'tag'], function(name) {
      expect(name).to.equal('tag');
    });

    result = att.withEmpty('bogus1 bogus2', function(defaultName) {
      expect(defaultName).to.equal('defaultName');
    }, 'defaultName');
    expect(result).to.equal(att);

    result = att.withEmpty('one bogus2', function(defaultName) {
      expect(defaultName).to.equal('one');
    }, 'defaultName');
    expect(result).to.equal(att);
    expect(att.has('one')).to.equal(false);

    result = att.withEmpty('bogus1 bogus2', function() {
      throw new Error('Should not reach here as list is not valid');
    }, 'defaultName', true);
    expect(result).to.equal(att);
  });

  it('getAll()', function() {
    expect(inject('one two first="1st" second="2nd"').getAttributesManager().getAll())
      .to.deep.equal({
        id: id,
        one: '',
        two: '',
        first: '1st',
        second: '2nd'
      });

    expect($('.bogus').getAttributesManager().getAll()).to.deep.equal({});
  });

  it('getEmpty()', function() {
    var empty = inject('one two first="1st" second="2nd"').getAttributesManager().getEmpty();

    expect(_.includes(empty, 'one')).to.equal(true);
    expect(_.includes(empty, 'two')).to.equal(true);

    expect($('.bogus').getAttributesManager().getEmpty()).to.deep.equal([]);
  });

  it('getWithPrefix()', function() {
    expect(function() {
      inject('').getAttributesManager().getWithPrefix();
    }).to.throw(/specify prefix/);

    expect(inject('my-one my-two my-first="1st" second="2nd" empty').getAttributesManager().getWithPrefix('my-'))
      .to.deep.equal({
        'my-one': '',
        'my-two': '',
        'my-first': '1st'
      });

    expect($('.bogus').getAttributesManager().getWithPrefix('my')).to.deep.equal({});
  });

  it('getEmptyWithPrefix()', function() {
    expect(function() {
      inject('').getAttributesManager().getEmptyWithPrefix();
    }).to.throw(/specify prefix/);

    var empty = inject('my-one my-two my-first="1st" second="2nd" empty').getAttributesManager().getEmptyWithPrefix('my-');

    expect(_.includes(empty, 'my-one')).to.equal(true);
    expect(_.includes(empty, 'my-two')).to.equal(true);

    expect($('.bogus').getAttributesManager().getEmptyWithPrefix('my')).to.deep.equal([]);
  });

  it('remove()', function() {
    var
      node = inject('one two first="1st" second="2nd"'),
      att = node.getAttributesManager(),
      result
      ;

    att.remove('one');
    expect(att.has('one')).to.equal(false);
    expect(node.attr('one')).to.not.exist;

    att.remove('second');
    expect(att.has('second')).to.equal(false);
    expect(node.attr('second')).to.not.exist;

    expect(node.attr('bogus')).to.not.exist;
    expect(att.remove('bogus')).to.equal(att);

    expect($('.bogus').getAttributesManager().remove('bogus')).to.be.an('object');
  });

  it('removeEmpty()', function() {
    var
      node = inject('one two first="1st" second="2nd"'),
      att = node.getAttributesManager(),
      result
      ;

    att.removeEmpty('one');
    expect(att.has('one')).to.equal(false);
    expect(node.attr('one')).to.not.exist;

    att.removeEmpty('second');
    expect(att.has('second')).to.equal(true);
    expect(node.attr('second')).to.exist;

    expect(node.attr('bogus')).to.not.exist;
    expect(att.removeEmpty('bogus')).to.equal(att);

    expect($('.bogus').getAttributesManager().removeEmpty('my')).to.be.an('object');
  });

  it('remove() with list', function() {
    var
      node = inject('one two first="1st" second="2nd"'),
      att = node.getAttributesManager(),
      result
      ;

    expect(att.has('two')).to.equal(true);
    expect(att.has('first')).to.equal(true);
    expect(att.remove('two first')).to.be.an('object');
    expect(att.has('two')).to.equal(false);
    expect(node.attr('two')).to.not.exist;
    expect(att.has('first')).to.equal(false);
    expect(node.attr('first')).to.not.exist;

    expect(node.attr('bogus')).to.not.exist;
    expect(att.remove('bogus bogus2')).to.equal(att);

    expect($('.bogus').getAttributesManager().remove('bogus bogus2')).to.be.an('object');

    att.add('some', 'value');
    expect(att.remove()).to.equal(att);
    expect(att.getAll()).to.deep.equal({});

    att.add('some', 'value');
    expect(att.remove('')).to.equal(att);
    expect(att.getAll()).to.deep.equal({});
  });

  it('removeEmpty() with list', function() {
    var
      node = inject('one two first="1st" second="2nd" tag1 tag2="value"'),
      att = node.getAttributesManager(),
      result
      ;

    expect(att.has('two')).to.equal(true);
    expect(att.has('first')).to.equal(true);
    att.removeEmpty('two first');
    expect(att.has('two')).to.equal(false);
    expect(node.attr('two')).to.not.exist;
    expect(att.has('first')).to.equal(true);
    expect(node.attr('first')).to.exist;

    expect(att.removeEmpty(['tag1', 'tag2'])).to.be.an('object');
    expect(att.has('tag1')).to.equal(false);
    expect(att.has('tag2')).to.equal(true);

    expect(node.attr('bogus')).to.not.exist;
    expect(att.removeEmpty('bogus bogus2')).to.equal(att);

    expect($('.bogus').getAttributesManager().removeEmpty('bogus bogus2')).to.be.an('object');

    att.remove();
    att.add('some', '');
    expect(att.removeEmpty()).to.equal(att);
    expect(att.getAll()).to.deep.equal({});

    att.add('some', '');
    expect(att.removeEmpty('')).to.equal(att);
    expect(att.getAll()).to.deep.equal({});
  });

  it('removeWithPrefix()', function() {
    var
      node = inject('my-one my-two my-first="1st" second="2nd"'),
      att = node.getAttributesManager(),
      result
      ;

    expect(function() {
      att.removeWithPrefix('');
    }).to.throw(/specify prefix/);

    expect(att.removeWithPrefix('bogus')).to.equal(att);
    expect(att.getAll()).to.deep.equal({
      id: id,
      'my-one': '',
      'my-two': '',
      'my-first': '1st',
      'second': '2nd'
    });

    expect(att.removeWithPrefix('my')).to.be.an('object');
    expect(att.getAll()).to.deep.equal({
      id: id,
      'second': '2nd'
    });

    expect($('.bogus').getAttributesManager().removeWithPrefix(['bogus'])).to.be.an('object');
  });

  it('removeEmptyWithPrefix()', function() {
    var
      node = inject('my-one my-two my-first="1st" second="2nd"'),
      att = node.getAttributesManager(),
      result
      ;

    expect(function() {
      att.removeEmptyWithPrefix('');
    }).to.throw(/specify prefix/);

    expect(att.removeEmptyWithPrefix('bogus')).to.equal(att);
    expect(att.getAll()).to.deep.equal({
      id: id,
      'my-one': '',
      'my-two': '',
      'my-first': '1st',
      'second': '2nd'
    });

    expect(att.removeEmptyWithPrefix('my')).to.be.an('object');
    expect(att.getAll()).to.deep.equal({
      id: id,
      'my-first': '1st',
      'second': '2nd'
    });

    expect($('.bogus').getAttributesManager().removeEmptyWithPrefix(['bogus'])).to.be.an('object');
  });

  it('getClass()', function() {
    expect(inject('class="one two"').getAttributesManager().getClass()).to.deep.equal(['one', 'two']);
  });

  it('hasClass()', function() {
    var att = inject('class="one two three"').getAttributesManager();

    expect(att.hasClass('')).to.equal(false);
    expect(att.hasClass('bogus1 bogus2')).to.equal(false);
    expect(att.hasClass('one bogus2')).to.equal(true);
    expect(att.hasClass('one two three')).to.equal(true);

    expect(att.hasClass(['bogus1', 'bogus2'])).to.equal(false);
    expect(att.hasClass(['one', 'bogus2'])).to.equal(true);

    expect($('.bogus').getAttributesManager().hasClass('bogus')).to.equal(false);
    expect($('.bogus').getAttributesManager().hasClass('bogus bogus2')).to.equal(false);
  });

  it('hasClassWithPrefix()', function() {
    var att = inject('class="one two three my-one my-two"').getAttributesManager();

    expect(function() {
      att.hasClassWithPrefix('');
    }).to.throw(/specify prefix/);

    expect(att.hasClassWithPrefix('my')).to.equal(true);
    expect(att.hasClassWithPrefix('my-o')).to.equal(true);
    expect(att.hasClassWithPrefix('bogus')).to.equal(false);

    expect($('.bogus').getAttributesManager().hasClassWithPrefix('bogus')).to.equal(false);
  });

  it('removeClass()', function() {
    var att = inject('class="one two three my-one my-two"').getAttributesManager();

    att.removeClass('one two');
    expect(att.getClass()).to.deep.equal(['three', 'my-one', 'my-two']);

    att.removeClass(['three', 'my-one']);
    expect(att.getClass()).to.deep.equal(['my-two']);
  });

  it('removeClassWithPrefix()', function() {
    var att = inject('class="one two three my-one my-two"').getAttributesManager();

    expect(function() {
      att.removeClassWithPrefix();
    }).to.throw(/specify prefix/);

    expect(att.removeClassWithPrefix('my')).to.be.an('object');
    expect(att.getClass()).to.deep.equal(['one', 'two', 'three']);

    expect(att.removeClassWithPrefix('bogus')).to.be.an('object');
    expect(att.getClass()).to.deep.equal(['one', 'two', 'three']);

    expect($('.bogus').getAttributesManager().removeClassWithPrefix('bogus')).to.be.an('object');
  });

  it('addClass()', function() {
    var att = inject('').getAttributesManager();

    att.addClass('one two');
    expect(att.getClass()).to.deep.equal(['one', 'two']);

    att.addClass(['three', 'four']);
    expect(att.getClass()).to.deep.equal(['one', 'two', 'three', 'four']);
  });

  it('add()', function() {
    var
      node = inject(''),
      att = node.getAttributesManager();

    att.add('first', '1st');
    expect(att.add('second', '2nd')).to.be.an('object');

    expect(att.getAll()).to.deep.equal({
      id: id,
      first: '1st',
      second: '2nd'
    });
    expect(node.attr('first')).to.exist;
    expect(node.attr('second')).to.exist;

    expect(function() {
      att.add();
    }).to.throw(/specify attribute name/);
  });

  it('update()', function() {
    var
      node = inject(''),
      att = node.getAttributesManager();

    expect(att.getAll()).to.deep.equal({id: id});
    node.attr('some', 'value');
    att.update();
    expect(att.getAll()).to.deep.equal({
      id: id,
      some: 'value'
    });
  });

});
