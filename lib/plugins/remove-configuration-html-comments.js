'use strict';

// this Babel plugin removes configuration comments such as:
//   <!-- template-lint triple-curlies=false -->
//   <!-- template-lint enabled=false -->


module.exports = function() {
  function RemoveConfigurationHtmlCommentsPlugin() {}

  RemoveConfigurationHtmlCommentsPlugin.prototype.transform = function(ast) {
    this.syntax.traverse(ast, {
      CommentStatement: function(node) {
        if (node.value.trim().indexOf('template-lint ') === 0) {
          // remove the entry
          return null;
        }
      }
    });

    return ast;
  };

  return RemoveConfigurationHtmlCommentsPlugin;
};
