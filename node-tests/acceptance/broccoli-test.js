'use strict';

const co = require('co');
const expect = require('chai').expect;
const broccoliTestHelper = require('broccoli-test-helper');
const createBuilder = broccoliTestHelper.createBuilder;
const createTempDir = broccoliTestHelper.createTempDir;

const TemplateLinter = require('../../broccoli-template-linter');
const fixturePath = `${__dirname}/../fixtures`;

describe('broccoli-template-linter', function() {
  let input, output, subject, mockConsole;

  beforeEach(co.wrap(function *() {
    this.timeout(10000);

    input = yield createTempDir();
    mockConsole = buildFakeConsole();
  }));

  afterEach(co.wrap(function *() {
    yield input.dispose();
    yield output.dispose();
  }));

  function buildFakeConsole() {
    return {
      _logLines: [],

      log(data) {
        this._logLines.push(data);
      }
    };
  }

  it('uses provided generateTestFile to return a test file', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = new TemplateLinter(`${input.path()}/app`, {
      console: mockConsole,
      generateTestFile(moduleName, tests) {
        return tests[0].errorMessage;
      }
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('templates');
    expect(result.templates).to.have.property('application.template.lint-test.js');

    let contents = result.templates['application.template.lint-test.js'];
    expect(contents).to.contain('Incorrect indentation for `div`');
    expect(contents).to.contain('Incorrect indentation for `p`');
    expect(contents).to.contain('HTML comment detected');
  }));

  it('returns an empty string if no generateTestFile is provided', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = new TemplateLinter(`${input.path()}/app`, {
      console: mockConsole
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('templates');
    expect(result.templates).to.have.property('application.template.lint-test.js');

    let contents = result.templates['application.template.lint-test.js'];
    expect(contents).to.equal('');
  }));

  it('prints warnings to console', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = new TemplateLinter(`${input.path()}/app`, {
      persist: false, // console messages are only printed when initially processed
      console: mockConsole,
      generateTestFile(moduleName, tests) {
        return tests[0].errorMessage;
      }
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('Incorrect indentation for `div`');
    expect(combinedLog).to.contain('Incorrect indentation for `p`');
    expect(combinedLog).to.contain('HTML comment detected');
  }));

  it('prints warnings when bare-strings is not used with a localization addon present', co.wrap(function *() {
    input.copy(`${fixturePath}/no-bare-strings`);

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    subject = new TemplateLinter(`${input.path()}/app`, {
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

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('ember-intl');
    expect(combinedLog).to.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when bare-strings is not used when a localization addon is not present', co.wrap(function *() {
    input.copy(`${fixturePath}/no-bare-strings`);

    subject = new TemplateLinter(`${input.path()}/app`, {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' }
        ]
      },
      generateTestFile() { }
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when bare-strings is specified in config', co.wrap(function *() {
    input.copy(`${fixturePath}/with-bare-strings`);

    // broccoliTestHelpers.makeTestHelper does a chdir, but after instantiation
    process.chdir(input.path());

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    subject = new TemplateLinter(`${input.path()}/app`, {
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

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `bare-strings` rule must be configured when using a localization framework');
  }));
});
