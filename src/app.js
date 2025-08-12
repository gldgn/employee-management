import { Router } from "@vaadin/router";
import "./components/nav-menu.js";
import "./components/employee-list.js";
import "./components/employee-form.js";

const outlet = document.createElement("div");
outlet.id = "outlet";
document.body.prepend(outlet);
document.body.prepend(document.createElement("nav-menu"));

const router = new Router(outlet);
router.setRoutes([
  { path: "/", redirect: "/employees" },
  { path: "/employees", component: "employee-list" },
  { path: "/employee/add", component: "employee-form" },
  {
    path: "/employee/edit/:id",
    action: (context) => {
      const el = document.createElement("employee-form");
      el.id = context.params.id;
      return el;
    },
  },
]);
