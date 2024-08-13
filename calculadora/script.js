function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.value += value;
  }
  
  function clearDisplay() {
    document.getElementById('display').value = '';
  }
  
  function deleteLastChar() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
  }
  
  function calculateResult() {
    const display = document.getElementById('display');
    try {
      let expression = display.value;
      
      // Converta porcentagens para decimal
      expression = expression.replace(/(\d+)%/g, (match, p1) => p1 / 100);
      
      // Calcular funções trigonométricas
      expression = expression.replace(/sin\(([^)]+)\)/g, (match, p1) => Math.sin(eval(p1)));
      expression = expression.replace(/cos\(([^)]+)\)/g, (match, p1) => Math.cos(eval(p1)));
      
      const result = eval(expression); // Avalia a expressão
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
    listItem.onclick = () => useHistory(entry);
    historyList.appendChild(listItem);
  
    // Armazenar histórico no Local Storage
    let history = JSON.parse(localStorage.getItem('history')) || [];
    
    // Limitar a 10 entradas
    history = history.slice(-9);
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
  
    // Limitar o número de itens na UI para 10
    if (historyList.children.length > 10) {
      historyList.removeChild(historyList.firstChild);
    }
  }
  
  // Função para usar um item do histórico como novo cálculo
  function useHistory(entry) {
    const display = document.getElementById('display');
    const result = entry.split(' = ')[0]; // Obtém a expressão original
    display.value = result;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(entry => {
      const historyList = document.getElementById('history');
      const listItem = document.createElement('li');
      listItem.textContent = entry;
      listItem.onclick = () => useHistory(entry);
      historyList.appendChild(listItem);
    });
  });
  