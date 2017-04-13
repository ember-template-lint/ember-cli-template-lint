'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = require('ember-cli-blueprint-test-helpers/lib/ember-generate');
//var modifyPackages = blueprintHelpers.modifyPackages;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

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
    var args = ['ember-cli-template-lint'];

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
    var args = ['ember-cli-template-lint'];

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
