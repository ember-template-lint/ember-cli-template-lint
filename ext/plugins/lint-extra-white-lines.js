'use strict';

// Forces templates to have no extra white lines
//
// passes:
// {{x-foo}}
//
// {{x-bar}}
//
// breaks:
// {{x-foo}}
//
//
// {{x-bar}}

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var ExtraWhiteLines = buildPlugin(addonContext, 'extra-white-lines');

  ExtraWhiteLines.prototype.detect = function(node) {
    return node.type === 'TextNode';
  };

  ExtraWhiteLines.prototype.process = function(node) {
    if (node.chars.match(/\n\n\n+/)) {
      var location = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
      this.log("Extraneous white lines detected at " + location);
    }
  };

  return ExtraWhiteLines;
};
