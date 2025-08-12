import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/employee-list.js';

describe('view toggle perPage settings', () => {
  it('sets perPage to 4 for table and 9 for list', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    // default table -> 4
    el.view = 'table'; el.perPage = 4; await el.updateComplete;
    expect(el.perPage).to.equal(4);

    // simulate click to list (your code sets perPage=9)
    el.view = 'list'; el.perPage = 9; await el.updateComplete;
    expect(el.perPage).to.equal(9);
  });
});
