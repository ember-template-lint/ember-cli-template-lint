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
    var result = /\n\n\n+/.exec(node.chars);
    if (result) {
      var charsBefore = node.chars.slice(0, result.index);
      var linesBefore = charsBefore.replace(/[^\n]/g, '').length;
      var start = {
        line: node.loc && node.loc.start.line + 2 + linesBefore,
        column: 0
      };

      var location = calculateLocationDisplay(this.options.moduleName, start);
      this.log('Extraneous white lines detected at ' + location);
    }
  };

  return ExtraWhiteLines;
};
