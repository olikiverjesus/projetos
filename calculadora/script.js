function appendToDisplay(value) {
  const display = document.getElementById('display');
  display.value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculateResult() {
  const display = document.getElementById('display');
  try {
    const result = eval(display.value); // Avalia a expressão
    addToHistory(display.value + ' = ' + result);
    display.value = result;
  } catch (e) {
    display.value = 'Erro';
  }
}

function addToHistory(entry) {
  const historyList = document.getElementById('history');
  const listItem = document.createElement('li');
  listItem.textContent = entry;
  historyList.appendChild(listItem);

  // Armazenar histórico no Local Storage
  let history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(entry);
  localStorage.setItem('history', JSON.stringify(history));
}

// Inicializar histórico ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.forEach(entry => {
    const historyList = document.getElementById('history');
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
  });
});
