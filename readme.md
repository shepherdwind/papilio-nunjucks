## papilio-nunjucks

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]


[npm-image]: http://img.shields.io/npm/v/papilio-nunjucks.svg?style=flat-square
[npm-url]: http://npmjs.org/package/papilio-nunjucks
[travis-image]: https://img.shields.io/travis/shepherdwind/papilio-nunjucks.svg?style=flat-square
[travis-url]: https://travis-ci.org/shepherdwind/papilio-nunjucks
[coveralls-image]: https://img.shields.io/coveralls/shepherdwind/papilio-nunjucks.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shepherdwind/papilio-nunjucks?branch=master


### API

```js
var nunjucks = require('papilio-nunjucks');
nunjucks(base)
.filter('stringify', JSON.stringify)
.engine('.vm', function(name) {
  // .vm file retrun empty string
  return '';
})
.engine('.css', function(file) {
  // css wraped with style tag
  var str = fs.readFileSync(file).toString();
  return '<style>\n' + str + '</style>';
})
.use(function(schema) {
  return getData(schema);
})
.render('index.html')
```

### async render tag

You could use methd `yield()` to change render method retrun an promise, so you
can pass an generator function to use method, like this:

```js
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
})
.catch(done);
```

In koa, you can write code like this:

```
var view = nunjucks(base).yield().use(this.services.getData);
return yield view.render(xx.html)
```

### use tag

Add a custom tag support

```html
{% use 'schemas/shop.js' %}
  {{title}} is {{url}} {{img}}
{% enduse %}
```

The template wraped by use tag, then, those template context will be the use
method return value.

Such as `use 'schemas/shop'` return an object `{title: 1, url: 2, img: 3}`, then
use tag render as `1 is 2 3`.

When use tag return a array, template render just like for loop. Each loop run,
the template context will change to the current array item object. Also you can
use loop local variable.

You can see more example as code `test/extention.test.js`.

