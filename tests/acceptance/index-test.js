import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | Homepage', function(hooks) {
  setupApplicationTest(hooks);

  test('the configuration html comment should be removed', async function(assert) {
    await visit('/');

    let firstNode = document.querySelector('.ember-application').childNodes[0];
    assert.ok(firstNode.nodeType !== firstNode.COMMENT_NODE);
  });
});
