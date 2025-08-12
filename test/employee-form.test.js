import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/employee-form.js";
describe("employee-form (JS)", () => {
  it("renders inputs", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const firstName = el.shadowRoot.querySelector('input[name="firstName"]');
    const email = el.shadowRoot.querySelector('input[name="email"]');
    expect(firstName).to.exist;
    expect(email).to.exist;
  });
});
