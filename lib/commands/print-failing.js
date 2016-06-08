var path = require('path');
var fs = require('fs');
var Linter = require('ember-template-lint');
var walkSync = require('walk-sync');

module.exports = {
  name: 'template-lint:print-failing',
  description: 'Get current list of all failing templates. This can be used to update the `pending` listing in `.template-lintrc.js`.',
  works: 'insideProject',

  availableOptions: [],

  run: function(options) {
    var project = this.project;
    var modulePrefix = project.config().modulePrefix;
    var linter = new Linter();
    var templatesWithErrors = [];

    var templateFiles = walkSync('app')
          .filter(function(file) {
            // remove any non-hbs files
            return path.extname(file) === '.hbs';
          });

    templateFiles.forEach(function(file) {
      var filePath = path.join('app', file);
      var contents = fs.readFileSync(filePath, { encoding: 'utf8' });
      var moduleId = path.join(modulePrefix, file).slice(0, -4);

      var errors = linter.verify({
        source: contents,
        moduleId: moduleId
      });

      var failingRules = errors.reduce(function(memo, error) {
        if (memo.indexOf(error.rule) === -1) {
          memo.push(error.rule);
        }

        return memo;
      }, []);

      if (failingRules.length > 0) {
        templatesWithErrors.push({ moduleId: moduleId, only: failingRules });
      }
    });

    console.log('Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n');
    console.log('pending: ' + JSON.stringify(templatesWithErrors, null, 2));
  }
};
