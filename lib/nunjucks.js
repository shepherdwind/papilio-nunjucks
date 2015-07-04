'use strict';

var nunjucks = require('nunjucks');
var Environment = nunjucks.Environment;
var Extension = require('./extension');
var RequireExtension = require('./require');
var Frame = nunjucks.runtime.Frame;
var assign = require('object-assign');

var Loader = require('./loader');

function defineProperty(o, key, val) {
  Object.defineProperty(o, key, {
    value: val,
    writable: false
  });
}

var View = function(base) {
  if (!(this instanceof View)) {
    return new View(base);
  }

  var env = new Environment(new Loader(base, this));
  env.addExtension('UseExtension', new Extension(this));
  env.addExtension('RequireExtension', new RequireExtension(this));

  defineProperty(this, 'base', base);
  defineProperty(this, 'env', env);
  this.engines = {};
};

assign(View.prototype, {
  yield: function() {
    defineProperty(this, 'async', true);
    return this;
  },

  filter: function(name, fn) {
    this.env.addFilter(name, fn);
    return this;
  },

  render: function(view, data) {
    var env = this.env;
    var tmpl = env.getTemplate(view);
    var frame = new Frame();
    this.frame = frame;

    if (this.async) {
      return new Promise(function(resolve, reject) {
        tmpl.render(data || {}, frame, function(err, ret) {
          if (err) {
            return reject(err);
          }
          return resolve(ret);
        });
      });
    }

    return tmpl.render(data || {}, frame);
  },
  use: function(fn, wrap) {
    defineProperty(this, 'use', fn);
    defineProperty(this, 'useWrap', wrap);
    return this;
  },
  engine: function(ext, fn) {
    this.engines[ext] = fn;
    return this;
  }
});


module.exports = View;
