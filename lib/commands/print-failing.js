'use strict';

const path = require('path');
const fs = require('fs');
const Linter = require('ember-template-lint');
const walkSync = require('walk-sync');

module.exports = {
  name: 'template-lint:print-failing',
  description: 'Get current list of all failing templates. This can be used to update the `pending` listing in `.template-lintrc.js`.',
  works: 'insideProject',

  availableOptions: [],

  appRoot() {
    let project = this.project;

    if (project.isEmberCLIAddon()) {
      return 'addon';
    } else if (project.isModuleUnification()) {
      return 'src';
    } else {
      return 'app';
    }
  },

  _scanForHbsFiles(dir) {
    return walkSync(dir, { globs: ['**/*.hbs'] });
  },

  getTemplateFiles() {
    let project = this.project;
    let appRoot = this.appRoot();

    if (project.isEmberCLIAddon()) {
      let files = this._scanForHbsFiles(appRoot);
      let moreFiles = this._scanForHbsFiles('tests/dummy/app');

      return files.concat(moreFiles);
    } else if (project.isModuleUnification()) {
      return this._scanForHbsFiles(appRoot);
    } else {
      return this._scanForHbsFiles(appRoot);
    }
  },

  run() {
    let appRoot = this.appRoot();
    let modulePrefix = this.project.config().modulePrefix;
    let linter = new Linter();
    let templatesWithErrors = [];
    let templateFiles = this.getTemplateFiles();

    templateFiles.forEach(file => {
      let filePath = path.join(appRoot, file);
      let contents = fs.readFileSync(filePath, { encoding: 'utf8' });
      let moduleId = path.join(modulePrefix, file).slice(0, -4);

      let errors = linter.verify({
        source: contents,
        moduleId: moduleId
      });

      let failingRules = errors.reduce((memo, error) => {
        if (memo.indexOf(error.rule) === -1) {
          memo.push(error.rule);
        }

        return memo;
      }, []);

      if (failingRules.length > 0) {
        templatesWithErrors.push({ moduleId: moduleId, only: failingRules });
      }
    });

    /* eslint-disable no-console */
    console.log('Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n');
    console.log('pending: ' + JSON.stringify(templatesWithErrors, null, 2));
    /* eslint-enable no-console */
  }
};
