'use strict';
var nunjucks = require('../lib/nunjucks');
var path = require('path');
var fs = require('fs');
var base = path.join(__dirname, './fixtures/');

describe('extention.test.js', function() {
  it('array should render as each', function() {
    nunjucks(base)
    .engine('.vm', function() {
      // no out put when ext is .vm
      return '';
    })
    .engine('.css', function(file) {
      var str = fs.readFileSync(file).toString();
      return '<style>\n' + str + '</style>';
    })
    .engine('.js', function(file) {
      var str = fs.readFileSync(file).toString();
      return '<script>\n' + str + '</script>';
    })
    .render('index.html')
    .trim()
    .should.eql('<style>\nbody {\n  color: red;\n}\n</style>\n<script>\nvar a = \'{% 112 %}\';\n</script>');
  });

  it('add filter support', function() {
    function discount(price, old) {
      return (price / old).toFixed(2);
    }
    nunjucks(base)
    .filter('stringify', JSON.stringify)
    .filter('discount', discount)
    .render('filter.html', { a: [1, 2], price: 6, old: 12})
    .trim()
    .should.eql('now [1,2] 0.50');
  });
});
