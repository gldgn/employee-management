import { LitElement, html } from "lit";
import { store } from "../store.js";
import { t } from "../i18n.js";
import "./delete-modal.js";

export class EmployeeList extends LitElement {
  static properties = {
    page: { type: Number },
    perPage: { type: Number },
    search: { type: String },
    view: { type: String },
    lang: { type: String },
    employees: { type: Array },
    modalOpen: { type: Boolean },
    modalName: { type: String },
    modalId: { type: String },
  };
  constructor() {
    super();
    this.page = 1;
    this.perPage = 9;
    this.search = "";
    this.view = "table";
    this.lang = document.documentElement.lang || "en";
    this.employees = store.getAll();
    this._unsub = store.subscribe(() => {
      this.employees = store.getAll();
    });
    this.modalOpen = false;
    this.modalName = "";
    this.modalId = null;
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
    super.disconnectedCallback();
    window.removeEventListener("app-lang", this._onLang);
    if (this._unsub) this._unsub();
  }
  get filtered() {
    const q = this.search.trim().toLowerCase();
    const all = this.employees;
    return q
      ? all.filter((e) =>
          (
            e.firstName +
            " " +
            e.lastName +
            " " +
            e.email +
            " " +
            e.department +
            " " +
            e.position
          )
            .toLowerCase()
            .includes(q)
        )
      : all;
  }
  get paged() {
    const start = (this.page - 1) * this.perPage;
    return this.filtered.slice(start, start + this.perPage);
  }
  totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.perPage));
  }
  openDelete(emp) {
    this.modalId = emp.id;
    this.modalName = emp.firstName + " " + emp.lastName;
    this.modalOpen = true;
  }
  confirmDelete() {
    if (this.modalId) {
      store.remove(this.modalId);
      this.modalOpen = false;
    }
  }

  renderToolbar() {
    const L = (k) => t(this.lang, k);
    const listIcon =
      this.view != "list"
        ? "/assets/listview-icon-active.png"
        : "/assets/listview-icon-inactive.png";
    const tableIcon =
      this.view != "table"
        ? "/assets/tableview-icon-active.png"
        : "/assets/tableview-icon-inactive.png";
    return html` <div class="toolbar">
      <div class="orange" style="font-size:21px;margin-bottom:15px;">
        ${L("employeeList")}
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <div style="display:flex;gap:8px;align-items:center">
          <button
            class="icon-btn"
            title="${L("list")}"
            @click=${() => {
              this.view = "table";
              this.perPage = 9;
              this.page = 1;
            }}
          >
            <img src="${listIcon}" alt="list view" />
          </button>
          <button
            class="icon-btn"
            title="${L("table")}"
            @click=${() => {
              this.view = "list";
              this.perPage = 4;
              this.page = 1;
            }}
          >
            <img src="${tableIcon}" alt="table view" />
          </button>
        </div>
      </div>
    </div>`;
  }
  renderTable() {
    const L = (k) => t(this.lang, k);
    return html` <table class="table card">
      <thead>
        <tr>
          <th>${L("firstName")}</th>
          <th>${L("lastName")}</th>
          <th>${L("doe")}</th>
          <th>${L("dob")}</th>
          <th>${L("phone")}</th>
          <th>${L("email")}</th>
          <th>${L("department")}</th>
          <th>${L("position")}</th>
          <th>${L("actions")}</th>
        </tr>
      </thead>
      <tbody>
        ${this.paged.map(
          (e) => html` <tr>
            <td>${e.firstName}</td>
            <td>${e.lastName}</td>
            <td>${e.doe}</td>
            <td>${e.dob}</td>
            <td>${e.phone}</td>
            <td>${e.email}</td>
            <td>${e.department}</td>
            <td>${e.position}</td>
            <td class="actions">
              <a
                class="icon-btn"
                href="/employee/edit/${e.id}"
                title="${L("edit")}"
                ><img src="/assets/edit-icon.png" alt="edit"
              /></a>
              <button
                class="icon-btn"
                @click=${() => this.openDelete(e)}
                title="${L("delete")}"
              >
                <img src="/assets/delete-icon.png" alt="delete" />
              </button>
            </td>
          </tr>`
        )}
      </tbody>
    </table>`;
  }
  renderList() {
    const L = (k) => t(this.lang, k);
    return html` <div
      class="grid"
      style="display:grid;grid-template-columns:repeat(auto-fill,minmax(460px,1fr));gap:45px 100px;"
    >
      ${this.paged.map(
        (e) => html`
          <div class="card">
            <div
              style="display:grid;grid-template-columns:auto 1fr;gap:20px 50px;font-size:14px;margin-left:10px;"
            >
              <div>
                <div class="list-label">${L("firstName")}</div>
                <div>${e.firstName}</div>
              </div>
              <div>
                <div class="list-label">${L("lastName")}</div>
                <div>${e.lastName}</div>
              </div>
              <div>
                <div class="list-label">${L("doe")}</div>
                <div>${e.doe}</div>
              </div>
              <div>
                <div class="list-label">${L("dob")}</div>
                <div>${e.dob}</div>
              </div>
              <div>
                <div class="list-label">${L("phone")}</div>
                <div>${e.phone}</div>
              </div>
              <div>
                <div class="list-label">${L("email")}</div>
                <div>${e.email}</div>
              </div>
              <div>
                <div class="list-label">${L("department")}</div>
                <div>${e.department}</div>
              </div>
              <div>
                <div class="list-label">${L("position")}</div>
                <div>${e.position}</div>
              </div>
            </div>
            <div
              style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"
            >
              <div style="display:flex;gap:0;margin-top:10px;">
                <a href="/employee/edit/${e.id}" title="${L("edit")}"
                  ><img
                    class="grid-buttons"
                    src="/assets/edit-button.png"
                    alt="edit"
                /></a>
                <button
                  @click=${() => this.openDelete(e)}
                  title="${L("delete")}"
                >
                  <img
                    class="grid-buttons"
                    src="/assets/delete-button.png"
                    alt="delete"
                  />
                </button>
              </div>
            </div>
          </div>
        `
      )}
    </div>`;
  }
  renderPagination() {
    const total = this.totalPages();
    if (total <= 1) return html``;
  
    const go = (p) => { if (p >= 1 && p <= total) this.page = p; };
  
    const current = this.page;
    const windowSize = 7; // keep your "7 visible buttons" look
    let start = Math.max(1, current - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - windowSize + 1);
    }
  
    const pageBtn = (p) => html`
      <button
        @click=${() => go(p)}
        style="background:${p === current ? '#ff6200' : '#f7f7f7'};
               border-color:${p === current ? '#ff6200' : '#f7f7f7'};
               color:${p === current ? 'white' : 'black'}"
      >
        ${p}
      </button>
    `;
  
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
  
    return html`
      <div class="pagination">
        <button
          style="border-color:#f7f7f7; background:#f7f7f7; color:#ff6200"
          @click=${() => go(current - 1)}
        >
          &lt;
        </button>
  
        ${start > 1
          ? html`${pageBtn(1)}<span>…</span>`
          : ''}
  
        ${pages.map(pageBtn)}
  
        ${end < total
          ? html`<span>…</span>${pageBtn(total)}`
          : ''}
  
        <button
          style="border-color:#f7f7f7; background:#f7f7f7; color:#ff6200"
          @click=${() => go(current + 1)}
        >
          &gt;
        </button>
      </div>
    `;
  }
  
  render() {
    return html`
      <link rel="stylesheet" href="/src/styles.css" />
      <div class="container">
        ${this.renderToolbar()}
        ${this.view === "table" ? this.renderTable() : this.renderList()}
        ${this.renderPagination()}
      </div>
      <delete-modal
        .open=${this.modalOpen}
        .name=${this.modalName}
        @proceed=${() => this.confirmDelete()}
        @close=${() => (this.modalOpen = false)}
      ></delete-modal>
    `;
  }
}
customElements.define("employee-list", EmployeeList);
