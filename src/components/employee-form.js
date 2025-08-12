import { LitElement, html } from "lit";
import { store } from "../store.js";
import { t } from "../i18n.js";

const POSITIONS = ["Junior", "Medior", "Senior"];
const DEPARTMENTS = ["Analytics","Tech"];

export class EmployeeForm extends LitElement {
  static properties = { id: { type: String }, lang: { type: String } };
  constructor() {
    super();
    window.addEventListener("app-lang", (e) => {
      this.lang = e.detail;
      this.requestUpdate();
    });
    this.id = null;
    this.lang = document.documentElement.lang || "en";
  }
  firstUpdated() {
    if (this.id) {
      const e = store.getById(this.id);
      if (e) {
        for (const [k, v] of Object.entries(e)) {
          const el = this.renderRoot?.querySelector(`[name="${k}"]`);
          if (el) el.value = v;
        }
      }
    }
  }
  get values() {
    const get = (name) =>
      (this.renderRoot.querySelector(`[name="${name}"]`)?.value ?? "").trim();
    return {
      firstName: get("firstName"),
      lastName: get("lastName"),
      doe: get("doe"),
      dob: get("dob"),
      phone: get("phone"),
      email: get("email"),
      department: get("department"),
      position: get("position"),
    };
  }
  validate() {
    const L = (k) => t(this.lang, k);
    let ok = true;
    this.renderRoot
      .querySelectorAll(".err")
      .forEach((n) => (n.textContent = ""));
    const v = this.values;
    const req = [
      "firstName",
      "lastName",
      "doe",
      "dob",
      "phone",
      "email",
      "department",
      "position",
    ];
    req.forEach((n) => {
      if (!v[n]) {
        ok = false;
        this.renderRoot.querySelector("#err-" + n).textContent = L("required");
      }
    });
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (v.email && !emailRe.test(v.email)) {
      ok = false;
      this.renderRoot.querySelector("#err-email").textContent =
        L("invalidEmail");
    }
    const phoneRe = /^[+\d\s()\-]{7,}$/;
    if (v.phone && !phoneRe.test(v.phone)) {
      ok = false;
      this.renderRoot.querySelector("#err-phone").textContent =
        L("invalidPhone");
    }
    if (store.existsByNameEmail(v.firstName, v.lastName, v.email, this.id)) {
      ok = false;
      this.renderRoot.querySelector("#err-email").textContent = L("uniqueFail");
    }
    return ok;
  }
  submit(e) {
    e.preventDefault();
    if (!this.validate()) return;
    const v = this.values;
    if (this.id) store.update(this.id, v);
    else store.add(v);
    window.history.pushState({}, "", "/employees");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  render() {
    const L = (k, vars) => t(this.lang, k, vars);
    const editing = this.id ? store.getById(this.id) : null;
    return html` <link rel="stylesheet" href="/src/styles.css" />
      <div class="container">
        <div class="toolbar">
          <div class="orange" style="font-size:20px">
            ${this.id ? L("editEmployee") : L("addEmployee")}
          </div>
        </div>
        ${editing
          ? html`<div class="pill">
              ${L("youAreEditing", {
                name: editing.firstName + " " + editing.lastName,
              })}
            </div>`
          : ""}
        <form class="card" @submit=${(e) => this.submit(e)}>
          <div class="row">
            <div>
              <label>${L("firstName")}</label
              ><input class="input" name="firstName" />
              <div class="err" id="err-firstName"></div>
            </div>
            <div>
              <label>${L("lastName")}</label
              ><input class="input" name="lastName" />
              <div class="err" id="err-lastName"></div>
            </div>
            <div>
              <label>${L("doe")}</label
              ><input class="input" type="date" name="doe" />
              <div class="err" id="err-doe"></div>
            </div>
            <div>
              <label>${L("dob")}</label
              ><input class="input" type="date" name="dob" />
              <div class="err" id="err-dob"></div>
            </div>
            <div>
              <label>${L("phone")}</label><input class="input" name="phone" />
              <div class="err" id="err-phone"></div>
            </div>
            <div>
              <label>${L("email")}</label
              ><input class="input" type="email" name="email" />
              <div class="err" id="err-email"></div>
            </div>
            <div>
              <label>${L("department")}</label>
              <select class="input" name="department">
                ${DEPARTMENTS.map(
                  (d) => html`<option value="${d}">${d}</option>`
                )}
              </select>
              <div class="err" id="err-department"></div>
            </div>
            <div>
              <label>${L("position")}</label>
              <select class="input" name="position">
                ${POSITIONS.map(
                  (p) => html`<option value="${p}">${p}</option>`
                )}
              </select>
              <div class="err" id="err-position"></div>
            </div>
          </div>
          <div
            style="display:flex; gap:8px; justify-content:center; margin-top:12px;"
          >
            <button type="submit" class="">
              <img
                src="/assets/save-button.png"
                alt="${L("save")}"
                style="height:45px"
              />
            </button>
            <button
              type="button"
              class=""
              @click=${() => {
                window.history.back();
              }}
            >
              <img
                src="/assets/cancel-button.png"
                alt="${L("cancelß")}"
                style="height:45px"
              />
            </button>
          </div>
        </form>
      </div>`;
  }
}
customElements.define("employee-form", EmployeeForm);
