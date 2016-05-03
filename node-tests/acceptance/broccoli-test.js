'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var broccoliTestHelpers = require('broccoli-test-helpers');
var makeTestHelper = broccoliTestHelpers.makeTestHelper;
var cleanupBuilders = broccoliTestHelpers.cleanupBuilders;

var TemplateLinter = require('../../broccoli-template-linter');
var fixturePath = path.join(process.cwd(), 'node-tests', 'fixtures');

describe('broccoli-template-linter', function() {
  function makeBuilder(fixturePath) {
    return makeTestHelper({
      subject: TemplateLinter,
      fixturePath: fixturePath
    });
  }

  function buildFakeConsole() {
    return {
      _logLines: [],

      log: function(data) {
        this._logLines.push(data);
      }
    };
  }

  var mockConsole;

  beforeEach(function() {
    mockConsole = buildFakeConsole();
  });

  afterEach(function() {
    cleanupBuilders();
  });

  it('uses provided generateTestFile to return a test file', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      console: mockConsole,
      generateTestFile: function(moduleName, tests) {
        return tests[0].errorMessage;
      }
    })
      .then(function(results) {
        var outputPath = results.directory;
        var contents = fs.readFileSync(
          path.join(outputPath, 'templates', 'application.template-lint-test.js'),
          { encoding: 'utf8' }
        );

        assert.ok(contents.indexOf('Incorrect indentation for `div`') > -1);
        assert.ok(contents.indexOf('Incorrect indentation for `p`') > -1);
        assert.ok(contents.indexOf('HTML comment detected') > -1);
      });
  });

  it('returns an empty string if no generateTestFile is provided', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      console: mockConsole
    })
      .then(function(results) {
        var outputPath = results.directory;
        var contents = fs.readFileSync(
          path.join(outputPath, 'templates', 'application.template-lint-test.js'),
          { encoding: 'utf8' }
        );

        assert.equal(contents, '');
      });
  });

  it('prints warnings to console', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      persist: false, // console messages are only printed when initially processed
      console: mockConsole,
      generateTestFile: function(moduleName, tests) {
        return tests[0].errorMessage;
      }
    })
      .then(function() {
        var combinedLog = mockConsole._logLines.join('\n');

        assert.ok(combinedLog.indexOf('Incorrect indentation for `div`') > -1);
        assert.ok(combinedLog.indexOf('Incorrect indentation for `p`') > -1);
        assert.ok(combinedLog.indexOf('HTML comment detected') > -1);
      });
  });

});
