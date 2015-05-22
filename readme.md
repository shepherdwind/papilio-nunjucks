## papilio-nunjucks

### use

```
var nunjucks = require('@alipay/papilio-nunjucks');
nunjucks(base)
.engine('.vm', function(name) {
  // vm文件不输出
  return '';
})
.engine('.css', function(file) {
  // css自动追加style
  var str = fs.readFileSync(file).toString();
  return '<style>\n' + str + '</style>';
})
.use(function(schema) {
  return getData(schema);
})
.render('index.html')
```

### 异步tag是使用

当use方法返回一个Promise或者是一个generator方法的时候，可以使用异步的render方法:

```
nunjucks(base)
.use(function*() {
  var data = yield Promise.resolve({name: 'inner'});
  return data;
})
.render('use/html.html', function(err, ret) {
  if (err) {
    return done(err);
  }
  ret.trim()
  .should
  .eql('<div> inner </div>');
});

```

### 语法

增加tag use

```
{% use 'schemas/shop.js' %}
  {{title}} is {{url}} {{img}}
{% enduse %}
```

use tag直接的变量上下文由use方法传递进来的函数返回数据决定，如果返回一个数组，
运行效果和for语法一直。

