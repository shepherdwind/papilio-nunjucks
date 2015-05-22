'use strict';
var nunjucks = require('../lib/nunjucks');
var path = require('path');
var fs = require('fs');
var base = path.join(__dirname, './fixtures/');

describe('extention.test.js', function() {
  it('array should render as each', function() {
    nunjucks(base)
    .engine('.vm', function(name) {
      // no out put when ext is .vm
      return '';
    })
    .engine('.css', function(file) {
      var str = fs.readFileSync(file).toString();
      return '<style>\n' + str + '</style>';
    })
    .render('index.html')
    .trim()
    .should.eql('<style>\nbody {\n  color: red;\n}\n</style>');
  });
});
