'use strict';

function encode(string) {
  return encodeURIComponent(string);
}

function decode(string) {
  return decodeURIComponent(string);
}

function stringifyCookieValue(value) {
  return encode(_.isObject(value) ? JSON.stringify(value) : '' + value);
}

function read(string) {
  if (string === '') {
    return string;
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '));

  try {
    string = JSON.parse(string);
  }
  catch(e) {}

  return string;
}

function setCookie(key, value, options) {
  options = options || {};

  if (typeof options.expires === 'number') {
    var days = options.expires;
    var time = options.expires = new Date();

    time.setMilliseconds(time.getMilliseconds() + days * 864e+5);
  }

  /* istanbul ignore next */
  document.cookie = [
    encode(key), '=', stringifyCookieValue(value),
    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    options.path ? '; path=' + options.path : '',
    options.domain ? '; domain=' + options.domain : '',
    options.secure ? '; secure' : ''
  ].join('');
}

function getCookie(key) {
  var result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split('; ') : [],
    i = 0,
    l = cookies.length;

  for (; i < l; i++) {
    var parts = cookies[i].split('='),
      name = decode(parts.shift()),
      cookie = parts.join('=');

    if (key === name) {
      result = read(cookie);
      break;
    }

    result[name] = cookie;
  }

  return result;
}

function removeCookie(key, options) {
  setCookie(key, '', _.merge({}, options, {
    expires: -1
  }));
}

function hasCookie(key) {
  return getCookie(key) !== undefined;
}


_.merge(q, {
  remove: {
    cookie: removeCookie
  },
  set: {
    cookie: setCookie
  },
  has: {
    cookie: hasCookie
  },
  get: {
    cookie: getCookie,
    all: {
      cookies: function() {
        return getCookie();
      }
    }
  }
});
