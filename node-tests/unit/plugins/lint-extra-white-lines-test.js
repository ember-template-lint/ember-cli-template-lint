'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'extra-white-lines',

  good: [
    '{{x-foo}}\n\n{{x-foo}}',
    '{{#x-foo}}\n\n{{/x-foo}}',
    '<div>\n\n</div>'
  ],

  bad: [
    {
      template: '{{x-foo}}\n\n\n{{x-foo}}',
      message: "Extraneous white lines detected at ('layout.hbs'@ L3:C0)"
    },
    // {
    //   template: '{{#x-foo}}\n\n\n{{/x-foo}}',
    //   message: "Extraneous white lines detected at ('layout.hbs'@ L3:C0)"
    // },
    {
      template: '<div>\n\n\n</div>',
      message: "Extraneous white lines detected at ('layout.hbs'@ L3:C0)"
    },
    {
      template: '\n\nfoo\n\n\n',
      message: "Extraneous white lines detected at ('layout.hbs'@ L5:C0)"
    }
  ]
});
