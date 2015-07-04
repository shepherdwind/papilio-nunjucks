'use strict';
var assign = require('object-assign');
var co = require('co');
function empty() { return null; }
function UseExtension(view) {
  this.tags = ['use'];
  this.view = view;
}

// 修改lookup方法，让use tag的变量查找首先查data对象
function generateLookup(data, lookup) {
  return function(key) {
    if (data.hasOwnProperty(key)) {
      return data[key];
    }
    return lookup.apply(this, arguments);
  };
}

assign(UseExtension.prototype, {
  parse: function(parser, nodes) {
    var tok = parser.nextToken();
    var args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(tok.value);
    var body = parser.parseUntilBlocks('enduse');
    parser.advanceAfterBlockEnd();

    var method = this.view.async ? 'CallExtensionAsync' : 'CallExtension';
    return new nodes[method](this, 'run', args, [body]);
  },

  run: function(context, url, body, callback) {
    var use = this.view.use || empty;
    var self = this;

    if (this.view.async && callback) {
      co(use(url))
      .then(function(data) {
        var ret = self._run(context, url, body, data);
        callback(null, ret);
      })
      .catch(callback);

      return null;
    }

    var ctx = use(url);
    if (ctx === null) {
      return body();
    }

    return this._run(context, url, body, ctx);
  },

  _run: function(context, url, body, ctx) {
    var frame = this.view.frame;
    var lookup = context.lookup;
    var frameLookup = frame.lookup;
    var wrap = this.view.useWrap;
    // 如果获得了数据，首先把context备份
    var ret;

    // 对于数据，循环执行body函数
    if (Array.isArray(ctx)) {
      var loop = { length: ctx.length, first: true, last: false };
      ret = ctx.map(function(data, i) {
        loop.index = i + 1;
        loop.index0 = i;
        if (i) { loop.first = false; }
        if (i === loop.length - 1) { loop.last = true; }
        // 修改context上下文数据
        assign(data, { loop: loop });

        context.lookup = generateLookup(data, lookup);
        frame.lookup = generateLookup(data, frameLookup);
        return body();
      }).join('');

    } else {

      context.lookup = generateLookup(ctx, lookup);
      frame.lookup = generateLookup(ctx, frameLookup);
      ret = body();
    }

    // 恢复原来的备份数据
    context.lookup = lookup;
    frame.lookup = frameLookup;
    if (typeof wrap === 'function') {
      return wrap(url, ret);
    }
    return ret;
  }
});

module.exports = UseExtension;
