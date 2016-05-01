'use strict';
/* jshint node: true */
/*eslint-env node*/

var Filter = require('broccoli-persistent-filter');
var md5Hex = require('md5-hex');
var stringify = require('json-stable-stringify');
var chalk = require('chalk');
var jsStringEscape = require('js-string-escape');
var Linter = require('ember-template-lint');

function TemplateLinter(inputNode, _options) {
  if (!(this instanceof TemplateLinter)) { return new TemplateLinter(inputNode, _options); }

  var options = _options || {};
  if (!options.hasOwnProperty('persist')) {
    options.persist = true;
  }

  Filter.call(this, inputNode, {
    annotation: options.annotation,
    persist: options.persist
  });


  this.options = options;
  this._console = this.options.console || console;
  this._templatercConfig = undefined;
  this._generateTestFile = this.options.generateTestFile || function() {
    return '';
  };
  this.linter = new Linter(options);
}

TemplateLinter.prototype = Object.create(Filter.prototype);
TemplateLinter.prototype.constructor = TemplateLinter;

TemplateLinter.prototype.extensions = ['hbs'];
TemplateLinter.prototype.targetExtension = 'template-lint-test.js';

TemplateLinter.prototype.baseDir = function() {
  return __dirname;
};

TemplateLinter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return md5Hex([
    stringify(this.linter.config),
    this._generateTestFile.toString(),
    string,
    relativePath
  ]);
};

TemplateLinter.prototype.build = function () {
  var self = this;
  self._errors = [];

  return Filter.prototype.build.apply(this, arguments)
    .finally(function() {
      if (self._errors.length > 0) {
        var label = ' Template Linting Error' + (self._errors.length > 1 ? 's' : '');
        self._console.log('\n' + self._errors.join('\n'));
        self._console.log(chalk.yellow('===== ' + self._errors.length + label + '\n'));
      }
    });
};

TemplateLinter.prototype.convertErrorToDisplayMessage = function(error) {
  return [
    error.message,
    '@',
    error.moduleId + 'L' + error.line + ':C' + error.column,
    'Source: `' + error.source + '`'
  ].join(' ');
};

TemplateLinter.prototype.processString = function(contents, relativePath) {
  var errors = this.linter.verify({
    source: contents,
    moduleId: relativePath
  });
  var passed = errors.length === 0;
  var errorDisplay = errors.map(function(error) {
    return this.convertErrorToDisplayMessage(error);
  });

  var output = this._generateTestFile(
    'TemplateLint - ' + relativePath,
    [{
      name: 'should pass TemplateLint',
      passed: passed,
      errorMessage: relativePath + ' should pass TemplateLint.' + jsStringEscape(errorDisplay)
    }]
  );

  return {
    errors: errors,
    output: output
  };
};

TemplateLinter.prototype.postProcess = function(results) {
  var errors = results.errors;

  for (var i = 0; i < errors.length; i++) {
    var errorDisplay = this.convertErrorToDisplayMessage(errors);
    this._errors.push(chalk.red(errorDisplay));
  }

  return results;
};

module.exports = TemplateLinter;
