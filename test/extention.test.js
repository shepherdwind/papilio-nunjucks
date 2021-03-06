'use strict';
var nunjucks = require('../lib/nunjucks');
var path = require('path');
var arr = [
  { title: 'hello', url: 'hanwen', img: 'haha' },
  { title: 'hello1', url: 'hanwen2', img: 'haha' }
];
var base = path.join(__dirname, './fixtures/');

describe('extention.test.js', function() {
  it('array should render as each', function() {
    nunjucks(base)
    .use(function() { return arr; })
    .render('use/simple.html')
    .trim()
    .should
    .eql('hello is hanwen haha  hello1 is hanwen2 haha');
  });

  it('loop.index should just like each', function() {
    nunjucks(base)
    .use(function() { return [{}, {}]; })
    .render('use/loop.html')
    .trim()
    .should
    .eql('0 1 true false 2\n\n1 2 false true 2');
  });

  it('object should render ok', function() {
    nunjucks(base)
    .use(function() { return arr[0]; })
    .render('use/simple.html')
    .trim()
    .should
    .eql('hello is hanwen haha');
  });

  it('use tag should keep the context no change', function() {
    nunjucks(base)
    .use(function() { return arr[0]; })
    .render('use/simple.html', { title: 'xx' })
    .trim()
    .should
    .eql('hello is hanwen haha \nxx');
  });

  it('work right context with set', function() {
    nunjucks(base)
    .use(function() { return {name: 'inner'}; })
    .render('use/set.html', { title: 'xx' })
    .trim()
    .should
    .eql('out\n inner \nout');
  });

  it('html context should not escape', function() {
    nunjucks(base)
    .use(function() { return {name: 'inner'}; })
    .render('use/html.html')
    .trim()
    .should
    .eql('<div> inner </div>');
  });
  it('mult use', function() {
    var data = {
      a: { name: 'a1' },
      b: [{name: 1}, {name: 2}],
      c: { name: 'c' }
    };
    nunjucks(base)
    .use(function(name) { return data[name]; })
    .render('use/mult.html', { name: 'out' })
    .trim()
    .should
    .eql('a1 \n 1  2 \n c \n\nout');
    data.b.should.eql([{name: 1}, {name: 2}]);
  });

  it('async use support', function(done) {
    nunjucks(base)
    .yield()
    .use(function() {
      return Promise.resolve({name: 'inner'});
    })
    .render('use/html.html').then(function(ret) {
      ret.trim()
      .should
      .eql('<div> inner </div>');
      done();
    })
    .catch(done);
  });

  it('async generator support', function(done) {
    nunjucks(base)
    .yield()
    .use(function*() {
      var data = yield Promise.resolve({name: 'inner'});
      return data;
    })
    .render('use/html.html').then(function(ret) {
      ret.trim()
      .should
      .eql('<div> inner </div>');
      done();
    }).catch(done);
  });

  it('use could wrap with tag', function() {
    nunjucks(base)
    .use(function() {
      return arr[0];
    }, function(name, html) {
      return '<div class="tag" data-schema="' + name + '">' + html +
             '</div>';
    })
    .render('use/simple.html')
    .trim()
    .should
    .eql('<div class="tag" data-schema="schemas/shop"> hello is hanwen haha </div>');
  });

  it('use as var should support', function() {
    nunjucks(base)
    .use(function() {
      return arr;
    })
    .render('use/as.html')
    .trim()
    .should
    .eql('hello\n    hanwen\n  \n    hello1\n    hanwen2');
  });

  it('vm extention support', function() {
    nunjucks(base)
    .use(function() {
      return arr;
    })
    .vm(function(name) {
      return '${' + name + '}';
    })
    .render('vm/b.html')
    .trim()
    .should
    .eql('hello ${user.name}');
  });

  it('vm extention support when no view', function() {
    nunjucks(base)
    .use(function() {
      return arr;
    })
    .render('vm/b.html')
    .trim()
    .should
    .eql('hello $!user.name');
  });
});
