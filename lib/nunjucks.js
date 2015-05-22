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
  render: function(view, data, callback) {
    if (typeof data === 'function') {
      callback = data;
      data = {};
    }

    var env = this.env;
    if (typeof callback === 'function') {
      this.async = true;
    } else {
      this.async = false;
    }

    var tmpl = env.getTemplate(view);
    this.frame = new Frame();

    return tmpl.render(data || {}, this.frame, callback);
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
