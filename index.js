/* jshint node: true */
/*eslint-env node*/
'use strict';

var VersionChecker = require('ember-cli-version-checker');
var TemplateLinter = require('./broccoli-template-linter');
var PrintFailing = require('./lib/commands/print-failing');

module.exports = {
  name: 'ember-cli-template-lint',

  includedCommands: function() {
    return {
      'template-lint:print-failing': PrintFailing
    };
  },

  lintTree: function(type, tree) {
    var checker = new VersionChecker(this);
    checker.for('ember-cli', 'npm').assertAbove('2.4.1');

    if (type === 'templates') {
      var ui = this.ui;
      var mockConsole = {
        log: function(data) {
          ui.writeLine(data);
        },

        error: function(data) {
          ui.writeLine(data, 'ERROR');
        }
      };

      return new TemplateLinter(tree, {
        annotation: 'TemplateLinter',
        templatercPath: this.project.root + '/.template-lintrc',
        generateTestFile: this.project.generateTestFile,
        _console: mockConsole
      });
    }
  },

  setupPreprocessorRegistry: function(type, registry) {
    var RemoveConfigurationHtmlComments = require('./lib/plugins/remove-configuration-html-comments');

    registry.add('htmlbars-ast-plugin', {
      name: 'remove-configuration-html-comments',
      plugin: RemoveConfigurationHtmlComments()
    });
  }
};
