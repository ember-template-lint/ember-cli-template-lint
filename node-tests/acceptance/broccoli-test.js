'use strict';

const path = require('path');
const fs = require('fs');
const co = require('co');
const expect = require('chai').expect;
const broccoliTestHelpers = require('broccoli-test-helpers');
const makeTestHelper = broccoliTestHelpers.makeTestHelper;
const cleanupBuilders = broccoliTestHelpers.cleanupBuilders;

const TemplateLinter = require('../../broccoli-template-linter');
const fixturePath = path.join(process.cwd(), 'node-tests', 'fixtures');

const root = process.cwd();

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

      log(data) {
        this._logLines.push(data);
      }
    };
  }

  let mockConsole;

  beforeEach(function() {
    mockConsole = buildFakeConsole();
  });

  afterEach(function() {
    process.chdir(root);

    return cleanupBuilders();
  });

  it('uses provided generateTestFile to return a test file', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'with-errors');
    let builder = makeBuilder(basePath);

    let results = yield builder('app', {
      console: mockConsole,
      generateTestFile(moduleName, tests) {
        return tests[0].errorMessage;
      }
    });

    let outputPath = results.directory;
    let contents = fs.readFileSync(
      path.join(outputPath, 'templates', 'application.template.lint-test.js'),
      { encoding: 'utf8' }
    );

    expect(contents).to.contain('Incorrect indentation for `div`');
    expect(contents).to.contain('Incorrect indentation for `p`');
    expect(contents).to.contain('HTML comment detected');
  }));

  it('returns an empty string if no generateTestFile is provided', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'with-errors');
    let builder = makeBuilder(basePath);

    let results = yield builder('app', {
      console: mockConsole
    });

    let outputPath = results.directory;
    let contents = fs.readFileSync(
      path.join(outputPath, 'templates', 'application.template.lint-test.js'),
      { encoding: 'utf8' }
    );

    expect(contents).to.equal('');
  }));

  it('prints warnings to console', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'with-errors');
    let builder = makeBuilder(basePath);

    yield builder('app', {
      persist: false, // console messages are only printed when initially processed
      console: mockConsole,
      generateTestFile(moduleName, tests) {
        return tests[0].errorMessage;
      }
    });

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('Incorrect indentation for `div`');
    expect(combinedLog).to.contain('Incorrect indentation for `p`');
    expect(combinedLog).to.contain('HTML comment detected');
  }));

  it('prints warnings when bare-strings is not used with a localization addon present', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'no-bare-strings');
    let builder = makeBuilder(basePath);

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    yield builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      },
      generateTestFile() { }
    });

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('ember-intl');
    expect(combinedLog).to.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when bare-strings is not used when a localization addon is not present', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'no-bare-strings');
    let builder = makeBuilder(basePath);

    yield builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' }
        ]
      },
      generateTestFile() { }
    });

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when bare-strings is specified in config', co.wrap(function *() {
    let basePath = path.join(fixturePath, 'with-bare-strings');
    let builder = makeBuilder(basePath);

    // broccoliTestHelpers.makeTestHelper does a chdir, but after instantiation
    process.chdir(basePath);

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    yield builder('app', {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      },
      generateTestFile() { }
    });

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));
});
