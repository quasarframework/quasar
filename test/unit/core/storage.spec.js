describe('Storage', function() {

  var
    keyOne = 'quasar-bogus-key-one',
    keyTwo = 'quasar-bogus-key-three',

    valueOne = 'quasar-value-one',
    valueTwo = {
      test: true,
      tset: {
        test: false
      }
    };

  afterEach(function() {
    quasar.clear.local.storage();
    quasar.clear.session.storage();
  });

  _.each(['local', 'session'], function(type) {

    describe('(' + type + ')', function() {

      it('should be able to get and set item', function() {
        expect(quasar.get[type].storage.item(keyOne)).to.equal(null);
        quasar.set[type].storage.item(keyOne, valueOne);
        expect(window[type + 'Storage'].getItem(keyOne)).to.equal('__q_strn|' + valueOne);
        expect(quasar.get[type].storage.item(keyOne)).to.equal(valueOne);
      });

      it('should be able to get length', function() {
        var length = quasar.get[type].storage.length();

        quasar.set[type].storage.item(keyOne, valueOne);
        expect(quasar.get[type].storage.length()).to.equal(++length);
        expect(quasar.get[type].storage.item(keyOne)).to.equal(valueOne);

        quasar.set[type].storage.item(keyOne, valueOne);
        expect(quasar.get[type].storage.length()).to.equal(length);
        expect(quasar.get[type].storage.item(keyOne)).to.equal(valueOne);
      });

      it('should be able to set an object as value', function() {
        quasar.set[type].storage.item(keyTwo, valueTwo);
        expect(quasar.get[type].storage.item(keyTwo)).to.deep.equal(valueTwo);
      });

      it('should be able to tell if item exists', function() {
        expect(quasar.get[type].storage.item(keyOne)).to.equal(null);
        expect(quasar.has[type].storage.item(keyOne)).to.equal(false);
        quasar.set[type].storage.item(keyOne, valueOne);
        expect(quasar.has[type].storage.item(keyOne)).to.equal(true);
      });

      it('should be able to remove an item', function() {
        expect(quasar.has[type].storage.item(keyOne)).to.equal(false);
        quasar.set[type].storage.item(keyOne, valueOne);
        expect(quasar.has[type].storage.item(keyOne)).to.equal(true);
        quasar.remove[type].storage.item(keyOne);
        expect(quasar.has[type].storage.item(keyOne)).to.equal(false);
      });

      it('should be able to remove all items', function() {
        expect(quasar.get[type].storage.length()).to.equal(0);
        quasar.set[type].storage.item(keyOne, valueOne);
        quasar.set[type].storage.item(keyTwo, valueTwo);
        expect(quasar.get[type].storage.length()).to.equal(2);
        quasar.clear[type].storage();
        expect(quasar.get[type].storage.length()).to.equal(0);
      });

      it('should be able to tell if storage is empty', function() {
        expect(quasar.get[type].storage.length()).to.equal(0);
        expect(quasar[type].storage.is.empty()).to.equal(true);
        quasar.set[type].storage.item(keyOne, valueOne);
        expect(quasar.get[type].storage.length()).to.equal(1);
        expect(quasar[type].storage.is.empty()).to.equal(false);
      });

      it('should be able to get item at index', function() {
        expect(quasar[type].storage.is.empty()).to.equal(true);
        quasar.set[type].storage.item(keyTwo, valueTwo);
        expect(quasar.get[type].storage.at.index(0)).to.deep.equal(valueTwo);
        expect(quasar.get[type].storage.at.index(1)).to.equal(undefined);
      });

      it('should be able to get all items', function() {
        expect(quasar[type].storage.is.empty()).to.equal(true);
        quasar.set[type].storage.item(keyOne, valueOne);
        quasar.set[type].storage.item(keyTwo, valueTwo);

        var repository = quasar.get.all[type].storage.items();

        expect(repository[keyOne]).to.equal(valueOne);
        expect(repository[keyTwo]).to.deep.equal(valueTwo);
      });

      it('should be able to write and read a date', function() {
        var
          result,
          date = new Date();

        quasar.set[type].storage.item(keyOne, date);

        result = quasar.get[type].storage.item(keyOne);
        expect(result).to.be.a('date');
        expect(result.toUTCString()).to.equal(date.toUTCString());
      });

      it('should be able to write and read a regular expression', function() {
        var
          result,
          regexp = /abc/;

        quasar.set[type].storage.item(keyOne, regexp);

        result = quasar.get[type].storage.item(keyOne);
        expect(result).to.be.an.instanceof(RegExp);
        expect(result.source).to.equal(regexp.source);
      });

      it('should be able to write and read a number', function() {
        var
          result,
          numbers = [4, 55.4, Math.PI];

        _.each(numbers, function(number) {
          quasar.set[type].storage.item(keyOne, number);

          result = quasar.get[type].storage.item(keyOne);
          expect(result).to.be.a('number');
          expect(result).to.equal(number);
        });
      });

      it('should be able to write and read a boolean', function() {
        var
          result,
          bools = [false, true];

        _.each(bools, function(bool) {
          quasar.set[type].storage.item(keyOne, bool);

          result = quasar.get[type].storage.item(keyOne);
          expect(result).to.be.a('boolean');
          expect(result).to.equal(bool);
        });
      });

      it('should be able to write and read a string', function() {
        var
          result,
          string = 'Quasar Framework';

        quasar.set[type].storage.item(keyOne, string);

        result = quasar.get[type].storage.item(keyOne);
        expect(result).to.be.a('string');
        expect(result).to.equal(string);
      });

      it('should be able to write and read a plain object', function() {
        var
          result,
          obj = {
            test: true,
            tset: {
              quasar: 'framework'
            }
          };

        quasar.set[type].storage.item(keyOne, obj);

        result = quasar.get[type].storage.item(keyOne);
        expect(result).to.be.an('object');
        expect(result).to.deep.equal(obj);
      });

      it('should be able to read an item not written by us', function() {
        var
          result,
          rawValues = ['raw', 'Some non-compliant value'];

        _.each(rawValues, function(rawValue) {
          window[type + 'Storage'].setItem(keyOne, rawValue);

          result = quasar.get[type].storage.item(keyOne);
          expect(result).to.be.a('string');
          expect(result).to.equal(rawValue);
        });
      });

      it('should be able to write and read an unsupported type like Function', function() {
        var
          result,
          obj = function() { return 5; };

        quasar.set[type].storage.item(keyOne, obj);

        result = quasar.get[type].storage.item(keyOne);
        expect(result).to.be.a('string');
        expect(result).to.equal(obj.toString());
      });

    });

  });

});
