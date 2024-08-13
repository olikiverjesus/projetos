// Função para adicionar um hábito
function adicionarHabito() {
  const habitoInput = document.getElementById('habito');
  const habitosContainer = document.getElementById('habitos');
  
  const nomeHabito = habitoInput.value.trim();

  if (nomeHabito === '') {
    alert('Por favor, insira um nome para o hábito.');
    return;
  }

  // Adicionar hábito ao Local Storage
  let habitos = JSON.parse(localStorage.getItem('habitos')) || [];
  if (!habitos.some(h => h.nome === nomeHabito)) {
    habitos.push({ nome: nomeHabito, registro: [] });
    localStorage.setItem('habitos', JSON.stringify(habitos));
  }

  // Atualizar visualização dos hábitos
  atualizarHabitos();
  habitoInput.value = ''; // Limpar campo de entrada
}

// Função para registrar um hábito
function registrarHabito(nome) {
  let habitos = JSON.parse(localStorage.getItem('habitos')) || [];
  const habito = habitos.find(h => h.nome === nome);
  
  if (habito) {
    const dataHoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    if (!habito.registro.includes(dataHoje)) {
      habito.registro.push(dataHoje);
      localStorage.setItem('habitos', JSON.stringify(habitos));
      atualizarHabitos();
    }
  }
}

// Função para atualizar visualização dos hábitos
function atualizarHabitos() {
  const habitosContainer = document.getElementById('habitos');
  habitosContainer.innerHTML = '';

  const habitos = JSON.parse(localStorage.getItem('habitos')) || [];
  habitos.forEach(habito => {
    const habitoElement = document.createElement('div');
    habitoElement.classList.add('habito');
    habitoElement.innerHTML = `
      <strong>${habito.nome}</strong>
      <button onclick="registrarHabito('${habito.nome}')">Registrar Hoje</button>
      <p>Registrado em: ${habito.registro.join(', ')}</p>
    `;
    habitosContainer.appendChild(habitoElement);
  });
}

// Inicializar visualização dos hábitos ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarHabitos);
