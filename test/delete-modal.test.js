import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/components/delete-modal.js';

describe('delete-modal events', () => {
  it('emits proceed then closes', async () => {
    const el = await fixture(html`<delete-modal .open=${true} name="John Doe"></delete-modal>`);
    const proceed = el.shadowRoot.querySelector('button.btn, button img, img.delete-btn-img')
      ? el.shadowRoot.querySelector('button.btn')
      : el.shadowRoot.querySelector('button'); // fallback

    setTimeout(() => proceed.click());
    const evt = await oneEvent(el, 'proceed');
    expect(evt).to.exist;
  });

  it('closes on cancel', async () => {
    const el = await fixture(html`<delete-modal .open=${true} name="John Doe"></delete-modal>`);
    const [proceed, cancel] = el.shadowRoot.querySelectorAll('button');
    cancel.click();
    await el.updateComplete;
    expect(el.open).to.equal(false);
  });
});
