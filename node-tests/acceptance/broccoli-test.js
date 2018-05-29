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

  it('generates a QUnit test file if "testGenerator: qunit" is provided', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      testGenerator: 'qunit'
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('templates');
    expect(result.templates).to.have.property('application.template.lint-test.js');

    let contents = result.templates['application.template.lint-test.js'];
    expect(contents).to.equal("QUnit.module('TemplateLint | templates/application.hbs');\nQUnit.test('should pass TemplateLint', function(assert) {\n  assert.expect(1);\n  assert.ok(false, 'templates/application.hbs should pass TemplateLint.\\n\\ntemplates/application.hbs\\n  5:9  error  Incorrect indentation for `div` beginning at L2:C0. Expected `</div>` ending at L5:C9 to be at an indentation of 0 but was found at 3.  block-indentation\\n  4:5  error  Incorrect indentation for `p` beginning at L3:C2. Expected `</p>` ending at L4:C5 to be at an indentation of 2 but was found at 1.  block-indentation\\n  -:-  error  HTML comment detected  html-comments\\n');\n});\n");
  }));

  it('generates a Mocha test file if "testGenerator: mocha" is provided', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      testGenerator: 'mocha'
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('templates');
    expect(result.templates).to.have.property('application.template.lint-test.js');

    let contents = result.templates['application.template.lint-test.js'];
    expect(contents).to.equal("describe('TemplateLint | templates/application.hbs', function() {\n  it('should pass TemplateLint', function() {\n    // test failed\n    var error = new chai.AssertionError('templates/application.hbs should pass TemplateLint.\\n\\ntemplates/application.hbs\\n  5:9  error  Incorrect indentation for `div` beginning at L2:C0. Expected `</div>` ending at L5:C9 to be at an indentation of 0 but was found at 3.  block-indentation\\n  4:5  error  Incorrect indentation for `p` beginning at L3:C2. Expected `</p>` ending at L4:C5 to be at an indentation of 2 but was found at 1.  block-indentation\\n  -:-  error  HTML comment detected  html-comments\\n');\n    error.stack = undefined;\n    throw error;\n  });\n});\n");
  }));

  it('generates a QUnit test file if "testGenerator: qunit" and "groupName: foo" are provided', co.wrap(function *() {
    this.timeout(10000);

    input.copy(`${fixturePath}/with-errors`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      testGenerator: 'qunit',
      groupName: 'foo'
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('foo.template.lint-test.js');

    let contents = result['foo.template.lint-test.js'];
    expect(contents.trim()).to.equal("QUnit.module('TemplateLint | foo');\n\nQUnit.test('templates/application.hbs', function(assert) {\n  assert.expect(1);\n  assert.ok(false, 'templates/application.hbs should pass TemplateLint.\\n\\ntemplates/application.hbs\\n  5:9  error  Incorrect indentation for `div` beginning at L2:C0. Expected `</div>` ending at L5:C9 to be at an indentation of 0 but was found at 3.  block-indentation\\n  4:5  error  Incorrect indentation for `p` beginning at L3:C2. Expected `</p>` ending at L4:C5 to be at an indentation of 2 but was found at 1.  block-indentation\\n  -:-  error  HTML comment detected  html-comments\\n');\n});");
  }));

  it('generates a Mocha test file if "testGenerator: mocha" and "groupName: foo" are provided', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      testGenerator: 'mocha',
      groupName: 'foo'
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('foo.template.lint-test.js');

    let contents = result['foo.template.lint-test.js'];
    expect(contents.trim()).to.equal("describe('TemplateLint | foo', function() {\n\n  it('templates/application.hbs', function() {\n    // test failed\n    var error = new chai.AssertionError('templates/application.hbs should pass TemplateLint.\\n\\ntemplates/application.hbs\\n  5:9  error  Incorrect indentation for `div` beginning at L2:C0. Expected `</div>` ending at L5:C9 to be at an indentation of 0 but was found at 3.  block-indentation\\n  4:5  error  Incorrect indentation for `p` beginning at L3:C2. Expected `</p>` ending at L4:C5 to be at an indentation of 2 but was found at 1.  block-indentation\\n  -:-  error  HTML comment detected  html-comments\\n');\n    error.stack = undefined;\n    throw error;\n  });\n\n});");
  }));

  it('generates empty test files if no "generateTestFile" option is provided', co.wrap(function *() {
    input.copy(`${fixturePath}/with-errors`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
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

    subject = TemplateLinter.create(`${input.path()}/app`, {
      persist: false, // console messages are only printed when initially processed
      console: mockConsole
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('Incorrect indentation for `div`');
    expect(combinedLog).to.contain('Incorrect indentation for `p`');
    expect(combinedLog).to.contain('HTML comment detected');
  }));

  it('prints warnings when no-bare-strings is not used with a localization addon present', co.wrap(function *() {
    input.copy(`${fixturePath}/no-bare-strings`);

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      }
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog).to.contain('ember-intl');
    expect(combinedLog).to.contain('The `no-bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when no-bare-strings is not used when a localization addon is not present', co.wrap(function *() {
    input.copy(`${fixturePath}/no-bare-strings`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' }
        ]
      }
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `no-bare-strings` rule must be configured when using a localization framework');
  }));

  it('does not print warning when no-bare-strings is specified in config', co.wrap(function *() {
    input.copy(`${fixturePath}/with-bare-strings`);

    // broccoliTestHelpers.makeTestHelper does a chdir, but after instantiation
    process.chdir(input.path());

    let localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      project: {
        addons: [
          { name: 'ember-cli-qunit' },
          { name: 'ember-cli-template-lint' },
          localizationAddon
        ]
      }
    });

    output = createBuilder(subject);
    yield output.build();

    let combinedLog = mockConsole._logLines.join('\n');

    expect(combinedLog)
      .to.not.contain('The `no-bare-strings` rule must be configured when using a localization framework');
  }));

  it('generates tests for .handlebars files', co.wrap(function *() {
    input.copy(`${fixturePath}/handlebars-extension`);

    subject = TemplateLinter.create(`${input.path()}/app`, {
      console: mockConsole,
      testGenerator: 'qunit'
    });

    output = createBuilder(subject);
    yield output.build();

    let result = output.read();
    expect(result).to.have.property('templates');
    expect(result.templates).to.have.property('application.template.lint-test.js');
  }));
});
