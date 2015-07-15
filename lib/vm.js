'use strict';
// vm extension
function Vm(view) {
  this.tags = ['vm'];
  this.view = view;

  this.parse = function(parser, nodes) {
    var tok = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtension(this, 'run', args, null);
  };

  this.run = function(context, name) {
    if (this.view.hasOwnProperty('vm')) {
      return this.view.vm(name);
    }
    return '$!' + name;
  };
}

module.exports = Vm;
