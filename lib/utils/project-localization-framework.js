'use strict';

module.exports = function(project) {
  var localizationAddon;

  for (var i = 0; i < project.addons.length; i++) {
    var addon = project.addons[i];

    if (addon.isLocalizationFramework) {
      localizationAddon = addon;
      break;
    }
  }

  return localizationAddon;
};
