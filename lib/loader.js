'use strict';

var path = require('path');
var fs = require('fs');

function Loader(base, view) {
  this.base = base;
  this.view = view;
}

Loader.prototype.getSource = function(name) {
  var ext = path.extname(name);
  var engine = this.view.engines[ext];
  var src = '';
  var fullpath = path.join(this.base, name);
  if (typeof engine === 'function') {
    src = engine(fullpath);
  } else {
    src = fs.readFileSync(fullpath).toString();
  }
  return {
    src: src,
    path: fullpath,
    noCache: true
  };
};

module.exports = Loader;
