const STORAGE_KEY = "employees";
const listeners = new Set();
function emit() {
  listeners.forEach((cb) => cb());
}
const sample = [
  {
    id: "1",
    firstName: "Ahmet",
    lastName: "Sourtimes",
    doe: "2022-09-23",
    dob: "1993-01-02",
    phone: "+(90) 532 123 45 67",
    email: "ahmet@sourtimes.org",
    department: "Analytics",
    position: "Junior",
  },
  {
    id: "2",
    firstName: "Ayşe",
    lastName: "Kaya",
    doe: "2023-03-11",
    dob: "1990-05-10",
    phone: "+90 532 555 44 33",
    email: "ayse.kaya@example.com",
    department: "Tech",
    position: "Senior",
  },
  {
    id: "3",
    firstName: "Mehmet",
    lastName: "Demir",
    doe: "2024-01-15",
    dob: "1995-08-20",
    phone: "+90 555 333 22 11",
    email: "mehmet.demir@example.com",
    department: "Analytics",
    position: "Medior",
  },
];
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
let employees = load();
export const store = {
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getAll() {
    return [...employees];
  },
  getById(id) {
    return employees.find((e) => e.id === id);
  },
  saveAll(list) {
    employees = [...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    emit();
  },
  add(emp) {
    emp.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    employees = [...employees, emp];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    emit();
    return emp.id;
  },
  update(id, patch) {
    employees = employees.map((e) => (e.id === id ? { ...e, ...patch } : e));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    emit();
  },
  remove(id) {
    employees = employees.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    emit();
  },
  existsByNameEmail(firstName, lastName, email, excludeId = null) {
    return employees.some(
      (e) =>
        e.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
        e.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() &&
        e.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        e.id !== excludeId
    );
  },
};
