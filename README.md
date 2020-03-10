# ember-cli-template-lint

[![npm version](https://badge.fury.io/js/ember-cli-template-lint.svg)](https://badge.fury.io/js/ember-cli-template-lint)
[![Build Status](https://travis-ci.org/ember-template-lint/ember-cli-template-lint.svg?branch=master)](https://travis-ci.org/ember-template-lint/ember-cli-template-lint)


## 🔴 DEPRECATED 🔴

**ember-cli-template-lint is deprecated!!**

Please use [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) directly instead.

More info / background:

* https://github.com/ember-cli/rfcs/pull/121
* https://github.com/emberjs/rfcs/blob/master/text/0121-remove-ember-cli-eslint.md
* https://github.com/ember-cli/ember-cli/pull/9009

## General Info

ember-cli-template-lint will lint your templates and add a test for each asserting
that all style rules have been satisfied.

For example, given the rule `no-bare-strings` is enabled, this template would be
in violation:

```hbs
{{! app/components/my-thing/template.hbs }}
<div>A bare string</div>
```

Thus a the test `TemplateLint: app/components/my-thing/template.hbs` would
fail with the assertion "A bare string was found (0:5)".

## Install

To install ember-cli-template-lint

```
ember install ember-cli-template-lint
```

__Ember CLI >= 2.4.2 is required for linting templates__

## Configuration

ember-cli-template-lint is powered by [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint)
which allows configuration by using a `.template-lintrc.js` file in the root of your project.

See [here](https://github.com/ember-template-lint/ember-template-lint/#rules) details on configuration and rules that are available.

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm run nodetest`
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Troubleshooting

If your files aren't linted make sure that you don't have the following option set in your `ember-cli-build.js`:
```js
var app = new EmberApp(defaults, {
  hinting: false
});
```
