import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/employee-list.js";
describe("employee-list (JS)", () => {
  it("renders table by default", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const table = el.shadowRoot.querySelector("table");
    expect(table).to.exist;
  });
});
