'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var broccoliTestHelpers = require('broccoli-test-helpers');
var makeTestHelper = broccoliTestHelpers.makeTestHelper;
var cleanupBuilders = broccoliTestHelpers.cleanupBuilders;

var TemplateLinter = require('../../broccoli-template-linter');
var fixturePath = path.join(process.cwd(), 'node-tests', 'fixtures');

var root = process.cwd();

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
    process.chdir(root);
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

  it('prints warnings when bare-strings is not used with a localization addon present', function() {
    var basePath = path.join(fixturePath, 'no-bare-strings');
    var builder = makeBuilder(basePath);

    var localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    return builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      },
      generateTestFile: function() { }
    })
      .then(function() {
        var combinedLog = mockConsole._logLines.join('\n');

        assert.ok(combinedLog.indexOf('ember-intl') > -1);
        assert.ok(combinedLog.indexOf('The `bare-strings` rule must be configured when using a localization framework') > -1);
      });
  });

  it('does not print warning when bare-strings is not used when a localization addon is not present', function() {
    var basePath = path.join(fixturePath, 'no-bare-strings');
    var builder = makeBuilder(basePath);

    return builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' }
        ]
      },
      generateTestFile: function() { }
    })
      .then(function() {
        var combinedLog = mockConsole._logLines.join('\n');

        assert.ok(combinedLog.indexOf('The `bare-strings` rule must be configured when using a localization framework') === -1);
      });
  });

  it('does not print warning when bare-strings is specified in config', function() {
    var basePath = path.join(fixturePath, 'with-bare-strings');
    var builder = makeBuilder(basePath);

    // broccoliTestHelpers.makeTestHelper does a chdir, but after instantiation
    process.chdir(basePath);

    var localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    return builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      },
      generateTestFile: function() { }
    })
      .then(function() {
        var combinedLog = mockConsole._logLines.join('\n');

        assert.ok(combinedLog.indexOf('The `bare-strings` rule must be configured when using a localization framework') === -1);
      });
  });
});
