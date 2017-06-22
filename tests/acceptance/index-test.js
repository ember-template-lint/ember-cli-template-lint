import { test } from 'qunit';
import $ from 'jquery';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Homepage');

test('the configuration html comment should be removed', function(assert) {
  visit('/');

  andThen(function() {
    let firstNode = $('.ember-view')[0].childNodes[0];
    assert.ok(firstNode.nodeType !== firstNode.COMMENT_NODE);
  });
});
