'use strict';

const co = require('co');
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = require('ember-cli-blueprint-test-helpers/lib/ember-generate');

const chai = require('ember-cli-blueprint-test-helpers/chai');
const expect = chai.expect;
const file = chai.file;

const td = require('testdouble');
const MockUI = require('console-ui/mock');

describe('Acceptance: ember generate and destroy ember-cli-template-lint', function() {
  setupTestHooks(this);

  before(function() {
    process.env.EMBER_DATA_SKIP_VERSION_CHECKING_DO_NOT_USE_THIS_ENV_VARIABLE = true;
  });

  after(function() {
    delete process.env.EMBER_DATA_SKIP_VERSION_CHECKING_DO_NOT_USE_THIS_ENV_VARIABLE;
    delete process.env.FORCE_LOCALIZED_FOR_TESTING;
  });

  let prompt;
  beforeEach(function() {
    prompt = td.function();
    td.replace(MockUI.prototype, 'prompt', prompt);
  });

  afterEach(function() {
    td.reset();
  });

  it('ember-cli-template-lint without localization framework', co.wrap(function *() {
    td.when(prompt(td.matchers.anything())).thenResolve({ answer: 'overwrite', deleteFiles: 'all' });

    yield emberNew();
    yield emberGenerate(['ember-cli-template-lint']);

    expect(file('.template-lintrc.js')).to.contain('extends: \'octane\'');
  }));

  it('ember-cli-template-lint with localization framework', co.wrap(function *() {
    process.env.FORCE_LOCALIZED_FOR_TESTING = true;

    td.when(prompt(td.matchers.anything())).thenResolve({ answer: 'overwrite', deleteFiles: 'all' });

    yield emberNew();
    yield emberGenerate(['ember-cli-template-lint']);

    expect(file('.template-lintrc.js')).to.contain('extends: \'octane\'');
    expect(file('.template-lintrc.js')).to.contain('\'no-bare-strings\': true');
  }));
});
