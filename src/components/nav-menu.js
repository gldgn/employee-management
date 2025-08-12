import { LitElement, html } from "lit";
import { t } from "../i18n.js";

export class NavMenu extends LitElement {
  static properties = { lang: { type: String } };

  constructor() {
    super();
    this.lang = document.documentElement.lang || "en";
    this._onLang = (e) => {
      this.lang = e.detail;
      this.requestUpdate();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("app-lang", this._onLang);
  }
  disconnectedCallback() {
    window.removeEventListener("app-lang", this._onLang);
    super.disconnectedCallback();
  }

  setLang(lang) {
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("app-lang", { detail: lang }));
  }

  render() {
    const L = (k, vars) => t(this.lang, k, vars);
    const path = window.location.pathname;

    return html`
      <link rel="stylesheet" href="/src/styles.css" />
      <nav class="app">
        <div class="inner container">
          <div class="brand">
            <img class="logo" src="/assets/inglogo.png" alt="ING logo" />
            <h5>ING</h5>
          </div>

          <div style="display:flex; gap:10px; align-items:center;">
            <img
              src="/assets/employees-icon.png"
              alt=""
              style="height:24px;width:auto"
            /><a
              class="link ${path.startsWith("/employees") ? "active" : ""}"
              href="/employees"
              >${L("employees")}</a
            >
            <a
              class="link ${path.startsWith("/employee/add") ? "active" : ""}"
              href="/employee/add"
              >+ ${L("addNew")}</a
            >

            <div class="lang-switch">
              ${this.lang === "en"
                ? html`<button
                    class="icon-btn"
                    @click=${() => this.setLang("tr")}
                    title="Türkçe"
                  >
                    <span class="flag">🇹🇷</span>
                  </button>`
                : html`<button
                    class="icon-btn"
                    @click=${() => this.setLang("en")}
                    title="English"
                  >
                    <span class="flag">🇺🇸</span>
                  </button>`}
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define("nav-menu", NavMenu);
