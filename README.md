# ember-cli-template-lint

[![npm version](https://badge.fury.io/js/ember-cli-template-lint.svg)](https://badge.fury.io/js/ember-cli-template-lint)
[![Build Status](https://travis-ci.org/ember-template-lint/ember-cli-template-lint.svg?branch=master)](https://travis-ci.org/ember-template-lint/ember-cli-template-lint)

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

**Ember CLI >= 2.4.2 is required for linting templates**

## Project's Current State

While this project is still maintained, it is not under active development.
This is why some recent Ember features are missing, as for instance co-located
components.

The reason is: a lot of experiements and improvements have been made around
linting. This project was one of them. But at the same time, linting as part of
ember-cli build pipeline has demonstrated not to be scalable with a growing Ember
app. It simply takes too long.

It is still possible to use this project. But you will probably have to add
features yourself.

### Alternate Approach

The alternate approach to using ember-cli-template-lint is to use "directly"
ember-template-lint.

1/ in CI: make sure to run `yarn lint:hbs` or `npm run lint:hbs`

2/ locally: you can setup your editor to display template-lint errors
in real time
([a useful link](https://discuss.emberjs.com/t/are-there-editor-integrations-for-ember-template-lint/14686))
and / or add git-hooks to automatically run linters. In that case, a git-hook
would look like this:
```sh
#!/bin/bash

# Run template-lint yarn script
echo "template-lint pre-push checks..."
echo

yarn lint:hbs || {
  echo
  echo "template-lint pre-push failed"
  exit 1
}
```

### Links

Here is a link to a RFC that proposes to remove
[ember-cli-eslint](https://github.com/emberjs/rfcs/blob/master/text/0121-remove-ember-cli-eslint.md)
from the default blueprints. The same reasoning can be applied to this project.

## Configuration

ember-cli-template-lint is powered by [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint)
which allows configuration by using a `.template-lintrc.js` file in the root of your project.

See [here](https://github.com/ember-template-lint/ember-template-lint/#rules) details on configuration and rules that are available.

### Installation

- `git clone` this repository
- `npm install`

### Running

- `ember server`
- Visit your app at http://localhost:4200.

### Running Tests

- `npm run nodetest`
- `ember test`
- `ember test --server`

### Building

- `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Troubleshooting

If your files aren't linted make sure that you don't have the following option set in your `ember-cli-build.js`:

```js
var app = new EmberApp(defaults, {
  hinting: false
});
```
