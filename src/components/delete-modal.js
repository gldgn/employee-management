import { LitElement, html } from "lit";
import { t } from "../i18n.js";
export class DeleteModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    name: { type: String },
    lang: { type: String },
  };
  constructor() {
    super();
    window.addEventListener("app-lang", (e) => {
      this.lang = e.detail;
      this.requestUpdate();
    });
    this.open = false;
    this.name = "";
    this.lang = document.documentElement.lang || "en";
  }
  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("close"));
  }
  proceed() {
    this.dispatchEvent(new CustomEvent("proceed"));
    this.open = false;
  }
  render() {
    const L = (k, vars) => t(this.lang, k, vars);
    if (!this.open) return html``;
    return html` <link rel="stylesheet" href="/src/styles.css" />
      <div
        class="modal-backdrop"
        @click=${(e) => {
          if (e.target === e.currentTarget) this.close();
        }}
      >
        <div class="modal">
          <header class="container orange">${L("areYouSure")}</header>
          <div class="content">
            <p>${L("deleteMsg", { name: this.name })}</p>
          </div>
          <footer>
            <button
              class="btn"
              @click=${() => this.proceed()}
              title="${L("Proceed")}"
            >
              <img
                class="proceed-btn-img"
                src="/assets/proceed-button.png"
                alt="${L("proceed")}"
              />
            </button>
            <button
              class="btn"
              @click=${() => this.close()}
              title="${L("cancel")}"
            >
              <img
                class="cancel-btn-img"
                src="/assets/cancel-button.png"
                alt="${L("cancel")}"
              />
            </button>
          </footer>
        </div>
      </div>`;
  }
}
customElements.define("delete-modal", DeleteModal);
