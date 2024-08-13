// Função para converter Markdown em HTML
function converterMarkdown(markdown) {
  // Você pode usar uma biblioteca como o marked.js para conversão de Markdown para HTML
  return marked(markdown);
}

// Função para salvar nota
function salvarNota() {
  const editor = document.getElementById('editor');
  const notasContainer = document.getElementById('notas');
  
  if (editor.value.trim() === '') {
    alert('Por favor, insira um texto.');
    return;
  }

  // Salvar nota no Local Storage
  let notas = JSON.parse(localStorage.getItem('notas')) || [];
  notas.push(editor.value);
  localStorage.setItem('notas', JSON.stringify(notas));

  // Atualizar visualização das notas
  atualizarNotas();
  editor.value = ''; // Limpar textarea
}

// Função para atualizar visualização das notas
function atualizarNotas() {
  const notasContainer = document.getElementById('notas');
  notasContainer.innerHTML = '';

  const notas = JSON.parse(localStorage.getItem('notas')) || [];
  notas.forEach(nota => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = converterMarkdown(nota);
    notasContainer.appendChild(noteElement);
  });
}

// Inicializar visualização das notas ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarNotas);
