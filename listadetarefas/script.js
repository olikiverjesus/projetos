let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const filters = {
  search: '',
  status: 'all'
};

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTask(e) {
  e.preventDefault();

  const text = document.getElementById('task-text').value.trim();
  const date = document.getElementById('task-date').value;
  const status = 'pending'; // Default status

  if (text === '') {
    alert('Por favor, adicione uma descrição.');
    return;
  }

  const task = {
    id: generateID(),
    text,
    date,
    status
  };

  tasks.push(task);
  updateLocalStorage();
  init();

  document.getElementById('task-form').reset();
}

function addTaskDOM(task) {
  const taskList = document.getElementById('task-list');

  const item = document.createElement('div');
  item.classList.add('task-item', task.status);
  item.innerHTML = `
    <span>${task.text} <small>${task.date ? ` - ${new Date(task.date).toLocaleDateString('pt-BR')}` : ''}</small></span>
    <div>
      <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
      <button onclick="removeTask(${task.id})">x</button>
    </div>
  `;

  taskList.appendChild(item);
}

function updateTasks() {
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  document.getElementById('task-list').innerHTML = '';
  filteredTasks.forEach(addTaskDOM);
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  document.getElementById('task-text').value = task.text;
  document.getElementById('task-date').value = task.date;
  removeTask(id);
}

function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateLocalStorage();
  updateTasks();
}

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function init() {
  updateTasks();
}

document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('search').addEventListener('input', (e) => {
  filters.search = e.target.value;
  updateTasks();
});
document.getElementById('filter').addEventListener('change', (e) => {
  filters.status = e.target.value;
  updateTasks();
});

init();
