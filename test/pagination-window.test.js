import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/employee-list.js';
import { store } from '../src/store.js';

function seed(n=100) { // ensure >7 pages in list view (9/page)
  const many = Array.from({length: n}, (_,i) => ({
    id: 'emp'+i, firstName:'Name'+i, lastName:'Last', doe:'2024-01-01', dob:'1990-01-01',
    phone:'+90 555 000 00 00', email:`user${i}@example.com`, department:'Tech', position:'Junior'
  }));
  store.saveAll(many);
}

describe('pagination sliding window', () => {
  beforeEach(() => { localStorage.clear(); seed(100); });

  it('slides beyond first 5 pages and shows current page in window', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.view = 'list'; el.perPage = 9; el.page = 6; // push beyond 5
    await el.updateComplete;

    // buttons text
    const buttons = [...el.shadowRoot.querySelectorAll('.pagination button')].map(b => b.textContent.trim());
    expect(buttons).to.include('6');

    // with many pages we should see an ellipsis
    const hasEllipsis = el.shadowRoot.querySelector('.pagination')?.textContent.includes('…');
    expect(hasEllipsis).to.equal(true);
  });

  it('prev/next change page within bounds', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.view='table'; el.perPage=4; el.page=2;
    await el.updateComplete;

    const nextBtn = [...el.shadowRoot.querySelectorAll('.pagination button')].find(b => b.textContent.includes('>'));
    nextBtn.click();
    await el.updateComplete;
    expect(el.page).to.equal(3);

    const prevBtn = [...el.shadowRoot.querySelectorAll('.pagination button')].find(b => b.textContent.includes('<'));
    prevBtn.click();
    await el.updateComplete;
    expect(el.page).to.equal(2);
  });
});
