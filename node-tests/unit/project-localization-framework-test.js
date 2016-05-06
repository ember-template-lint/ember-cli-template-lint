'use strict';

var assert = require('assert');
var projectLocalizationFramework = require('../../lib/utils/project-localization-framework');

describe('project-localization-framework', function() {
  function Project(addons) { this.addons = addons; }

  it('returns falsey when no addons have the `isLocalizationFramework` flag', function() {
    var project = new Project([
      { name: 'ember-cli-qunit' },
      { name: 'ember-cli-template-lint' }
    ]);

    assert.ok(!projectLocalizationFramework(project));
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

    assert.equal(projectLocalizationFramework(project), localizationAddon);
  });
});
