'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = require('ember-cli-blueprint-test-helpers/lib/ember-generate');

const chai = require('ember-cli-blueprint-test-helpers/chai');
const expect = chai.expect;
const file = chai.file;

describe('Acceptance: ember generate and destroy ember-cli-template-lint', function() {
  setupTestHooks(this);

  before(function() {
    process.env.EMBER_DATA_SKIP_VERSION_CHECKING_DO_NOT_USE_THIS_ENV_VARIABLE = true;
  });

  after(function() {
    delete process.env.EMBER_DATA_SKIP_VERSION_CHECKING_DO_NOT_USE_THIS_ENV_VARIABLE;
    delete process.env.FORCE_LOCALIZED_FOR_TESTING;
  });

  it('ember-cli-template-lint without localization framework', function() {
    let args = ['ember-cli-template-lint'];

    return emberNew()
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        expect(file('.template-lintrc.js')).to.contain('extends: \'recommended\'');
      });
  });

  it('ember-cli-template-lint with localization framework', function() {
    process.env.FORCE_LOCALIZED_FOR_TESTING = true;
    let args = ['ember-cli-template-lint'];

    return emberNew()
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        expect(file('.template-lintrc.js')).to.contain('extends: \'recommended\'');
        expect(file('.template-lintrc.js')).to.contain('\'bare-strings\': true');
      });
  });
});
