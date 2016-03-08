'use strict';

module.exports = {
  'bare-strings': require('./lint-bare-strings'),
  'block-indentation': require('./lint-block-indentation'),
  'extra-white-lines': require('./lint-extra-white-lines'),
  'html-comments': require('./lint-html-comments'),
  'triple-curlies': require('./lint-triple-curlies'),
  'nested-interactive': require('./lint-nested-interactive')
};
