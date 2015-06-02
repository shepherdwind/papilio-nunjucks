'use strict';

var nunjucks = require('nunjucks');
var Environment = nunjucks.Environment;
var Extension = require('./extension');
var Frame = nunjucks.runtime.Frame;
var assign = require('object-assign');

var Loader = require('./loader');

var View = function(base) {
  if (!(this instanceof View)) {
    return new View(base);
  }

  var env = new Environment(new Loader(base, this));
  env.addExtension('UseExtension', new Extension(this));

  this.base = base;
  this.env = env;
  this.engines = {};
  this.async = false;
};

assign(View.prototype, {
  yield: function() {
    this.async = true;
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
  use: function(fn) {
    this.use = fn;
    return this;
  },
  engine: function(ext, fn) {
    this.engines[ext] = fn;
    return this;
  }
});


module.exports = View;
