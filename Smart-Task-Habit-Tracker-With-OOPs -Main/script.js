class Task {
  constructor(
    title,
    description = "",
    category = "",
    dueDate = null,
    status = "pending"
  ) {
    this.id = Task.generateId();
    this.title = title;
    this.description = description;
    this.category = category;
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.status = status;
    this.createdAt = new Date();
  }

  static generateId() {
    return "t_" + Math.random().toString(36).slice(2, 9);
  }

  markComplete() {
    this.status = "completed";
  }
  update({ title, description, category, dueDate, status }) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.status = status;
  }

  isOverdue() {
    if (!this.dueDate) return false;
    const today = new Date();
    const d1 = new Date(
      this.dueDate.getFullYear(),
      this.dueDate.getMonth(),
      this.dueDate.getDate()
    );
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d1 < d2 && this.status !== "completed";
  }
}

class SpecialHabit extends Task {
  constructor(title, description, category, dueDate, status, streak = 0) {
    super(title, description, category, dueDate, status);
    this.streak = streak; // demonstrates extra property
  }

  incrementStreak() {
    this.streak += 1;
  }
  resetStreak() {
    this.streak = 0;
  }
}

// ======= memory store =======
let tasks = [];

// Sample tasks
tasks.push(
  new Task(
    "Morning Exercise",
    "20 mins run",
    "Fitness",
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  )
);
tasks.push(
  new Task("Read JS Book", "Chapters 3-4", "Study", null, "completed")
);
tasks.push(
  new SpecialHabit(
    "Meditation",
    "10 mins",
    "Habit",
    new Date().toISOString().slice(0, 10)
  )
);

// ======= DOM refs =======
const taskListEl = document.getElementById("taskList");
const dashboardEl = document.getElementById("dashboard");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const totalCount = document.getElementById("totalCount");
const visibleCount = document.getElementById("visibleCount");

const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const catInput = document.getElementById("category");
const dueInput = document.getElementById("dueDate");
const statusInput = document.getElementById("status");
const editIdInput = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filterBtn");

let activeFilter = "all";
let searchTerm = "";

// ======= Render =======
function render() {
  // filter & search
  let filtered = tasks.filter((t) => {
    // filter
    if (activeFilter === "pending" && t.status !== "pending") return false;
    if (activeFilter === "completed" && t.status !== "completed") return false;
    if (activeFilter === "overdue" && !t.isOverdue()) return false;

    // search
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (
        !(
          t.title.toLowerCase().includes(s) ||
          (t.category || "").toLowerCase().includes(s)
        )
      )
        return false;
    }
    return true;
  });

  // Task list
  taskListEl.innerHTML = "";
  filtered.forEach((t, idx) => {
    const li = document.createElement("li");
    li.className = "p-3 border rounded flex justify-between items-start gap-3";

    const left = document.createElement("div");
    left.className = "flex-1";
    const title = document.createElement("div");
    title.innerHTML = `<div class=\"font-medium text-gray-800\">${
      idx + 1
    }. ${escapeHtml(t.title)}</div>`;

    const meta = document.createElement("div");
    meta.className = "text-sm text-gray-500 mt-1";
    const dueText = t.dueDate
      ? `Due: ${t.dueDate.toLocaleDateString()}`
      : "No due date";
    const statusBadge =
      t.status === "completed"
        ? '<span class="px-2 py-0.5 rounded bg-green-100 text-green-700">Completed</span>'
        : t.isOverdue()
        ? '<span class="px-2 py-0.5 rounded bg-red-100 text-red-700">Overdue</span>'
        : '<span class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">Pending</span>';
    meta.innerHTML = `${escapeHtml(
      t.category || ""
    )} • ${dueText} • ${statusBadge}`;

    const desc = document.createElement("div");
    desc.className = "text-sm text-gray-600 mt-2";
    desc.textContent = t.description || "";

    left.appendChild(title);
    left.appendChild(meta);
    left.appendChild(desc);

    const actions = document.createElement("div");
    actions.className = "flex flex-col gap-2 items-end";

    const completeBtn = document.createElement("button");
    completeBtn.className = "px-3 py-1 bg-green-600 text-white rounded text-sm";
    completeBtn.textContent = "Complete";
    completeBtn.onclick = () => {
      markComplete(t.id);
    };

    const editBtn = document.createElement("button");
    editBtn.className = "px-3 py-1 bg-blue-500 text-white rounded text-sm";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      loadForEdit(t.id);
    };

    const delBtn = document.createElement("button");
    delBtn.className = "px-3 py-1 bg-red-500 text-white rounded text-sm";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      deleteTask(t.id);
    };

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    taskListEl.appendChild(li);
  });

  // Dashboard calculations
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter((t) => t.isOverdue()).length;

  dashboardEl.innerHTML = `
        <div class="p-3 border rounded text-center">
          <div class="text-sm text-gray-500">Total</div>
          <div class="font-semibold text-xl">${total}</div>
        </div>
        <div class="p-3 border rounded text-center">
          <div class="text-sm text-gray-500">Completed</div>
          <div class="font-semibold text-xl">${completed}</div>
        </div>
        <div class="p-3 border rounded text-center">
          <div class="text-sm text-gray-500">Pending</div>
          <div class="font-semibold text-xl">${pending}</div>
        </div>
        <div class="p-3 border rounded text-center">
          <div class="text-sm text-gray-500">Overdue</div>
          <div class="font-semibold text-xl">${overdue}</div>
        </div>
      `;

  // Progress bar
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = progress + "%";
  progressBar.style.backgroundColor = "rgba(59,130,246,0.8)";
  progressText.textContent = `Progress: ${progress}%`;

  totalCount.textContent = total;
  visibleCount.textContent = filtered.length;
}

// ======= Helpers =======
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ======= CRUD operations =======
function addTask(data) {
  const { title, description, category, dueDate, status } = data;
  const obj =
    category && category.toLowerCase().includes("habit")
      ? new SpecialHabit(title, description, category, dueDate, status)
      : new Task(title, description, category, dueDate, status);
  tasks.unshift(obj); // newest first
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function markComplete(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) {
    t.markComplete();
    if (t instanceof SpecialHabit) t.incrementStreak();
    render();
  }
}

function loadForEdit(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  titleInput.value = t.title;
  descInput.value = t.description;
  catInput.value = t.category;
  dueInput.value = t.dueDate ? t.dueDate.toISOString().slice(0, 10) : "";
  statusInput.value = t.status;
  editIdInput.value = t.id;
  submitBtn.textContent = "Update Task";
}

function updateTask(id, data) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  t.update(data);
  render();
}

// ======= Events =======
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    category: catInput.value.trim(),
    dueDate: dueInput.value || null,
    status: statusInput.value,
  };
  const editId = editIdInput.value;
  if (editId) {
    updateTask(editId, data);
    submitBtn.textContent = "Add Task";
    editIdInput.value = "";
  } else {
    addTask(data);
  }
  form.reset();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  editIdInput.value = "";
  submitBtn.textContent = "Add Task";
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim();
  render();
});

filterBtns.forEach((b) =>
  b.addEventListener("click", (e) => {
    activeFilter = b.dataset.filter;
    render();
    filterBtns.forEach((x) => x.classList.remove("bg-blue-500", "text-white"));
    b.classList.add("bg-blue-500", "text-white");
  })
);

// Initial state: select 'All'
document
  .querySelector('[data-filter="all"]')
  .classList.add("bg-blue-500", "text-white");

// initial render
render();

// ======= Extra: keyboard shortcuts (optional) =======
document.addEventListener("keydown", (e) => {
  if (e.key === "n" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    titleInput.focus();
  }
});
