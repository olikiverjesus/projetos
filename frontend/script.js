const apiUrl = 'http://localhost:5000/tarefas';

async function fetchTarefas() {
  const response = await fetch(apiUrl);
  const tarefas = await response.json();
  const tarefasList = document.getElementById('tarefasList');
  tarefasList.innerHTML = '';
  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.textContent = tarefa.nome;
    tarefasList.appendChild(li);
  });
}

async function adicionarTarefa() {
  const tarefaInput = document.getElementById('tarefaInput');
  const novaTarefa = { nome: tarefaInput.value };
  if (novaTarefa.nome) {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaTarefa)
    });
    tarefaInput.value = '';
    fetchTarefas();
  }
}

fetchTarefas();
