'use strict';

var debug = require('debug')('ember-cli-template-lint:localization-framework');

module.exports = function(project) {
  if (!project || !project.addons) {
    return undefined;
  }

  var localizationAddon;

  debug('Addons found in project: %s', project.addons.map(function(addon) { return addon.name; }));

  for (var i = 0; i < project.addons.length; i++) {
    var addon = project.addons[i];

    if (addon.isLocalizationFramework) {
      localizationAddon = addon;
      break;
    }
  }

  debug('Localization addon found: %s', localizationAddon);

  return localizationAddon;
};
