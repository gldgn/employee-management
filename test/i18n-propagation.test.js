import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/nav-menu.js';
import '../src/components/employee-list.js';

describe('i18n propagation', () => {
  it('updates component text when language changes', async () => {
    const nav = await fixture(html`<nav-menu></nav-menu>`);
    const list = await fixture(html`<employee-list></employee-list>`);
    expect(list.shadowRoot.textContent).to.include('Employee List');

    // switch to Turkish
    window.dispatchEvent(new CustomEvent('app-lang', { detail: 'tr' }));
    await list.updateComplete;
    expect(list.shadowRoot.textContent).to.include('Çalışan Listesi');

    // switch back to English
    window.dispatchEvent(new CustomEvent('app-lang', { detail: 'en' }));
    await list.updateComplete;
    expect(list.shadowRoot.textContent).to.include('Employee List');
  });
});
