'use strict';

var expect = require('chai').expect;
var projectLocalizationFramework = require('../../lib/utils/project-localization-framework');

describe('project-localization-framework', function() {
  function Project(addons) { this.addons = addons; }

  it('returns falsey when no addons have the `isLocalizationFramework` flag', function() {
    var project = new Project([
      { name: 'ember-cli-qunit' },
      { name: 'ember-cli-template-lint' }
    ]);

    expect(projectLocalizationFramework(project)).to.not.be.ok;
  });

  it('returns the addon when one has the `isLocalizationFramework` flag', function() {
    var localizationAddon = {
      name: 'ember-intl',
      isLocalizationFramework: true
    };

    var project = new Project([
      { name: 'ember-cli-qunit' },
      { name: 'ember-cli-template-lint' },
      localizationAddon
    ]);

    expect(projectLocalizationFramework(project)).to.equal(localizationAddon);
  });
});
