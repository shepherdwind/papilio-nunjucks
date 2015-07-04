'use strict';
var assign = require('object-assign');
var path = require('path');
var fs = require('fs');

function RequireExtension(view) {
  this.tags = ['require'];
  this.view = view;
}

assign(RequireExtension.prototype, {
  parse: function(parser, nodes) {
    var tok = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtension(this, 'run', args, null);
  },

  run: function(context, url) {
    var ext = path.extname(url);
    var base = this.view.base;
    var engine = this.view.engines[ext];
    var src = '';
    var fullpath = path.join(base, url);
    if (typeof engine === 'function') {
      src = engine(fullpath);
    } else {
      src = fs.readFileSync(fullpath).toString();
    }
    return src;
  }
});

module.exports = RequireExtension;
