// Array para armazenar transações
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Função para gerar ID único
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Adicionar transação ao histórico
function addTransaction(e) {
  e.preventDefault();

  const text = document.getElementById('transaction-text').value.trim();
  const amount = +document.getElementById('transaction-amount').value.trim();

  if (text === '' || isNaN(amount)) {
    alert('Por favor, adicione uma descrição e um valor válido');
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount,
    date: new Date(),
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateBalance();
  updateLocalStorage();

  document.getElementById('transaction-form').reset();
}

// Adicionar transação ao DOM
function addTransactionDOM(transaction) {
  const list = document.createElement('ul');
  const item = document.createElement('li');
  const monthYear = new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' });
  
  let monthGroup = document.querySelector(`[data-month="${monthYear}"]`);

  if (!monthGroup) {
    monthGroup = document.createElement('div');
    monthGroup.classList.add('month-group');
    monthGroup.dataset.month = monthYear;
    const monthTitle = document.createElement('h3');
    monthTitle.textContent = monthYear;
    monthGroup.appendChild(monthTitle);
    monthGroup.appendChild(list);
    document.getElementById('transaction-months').appendChild(monthGroup);
  } else {
    list = monthGroup.querySelector('ul');
  }

  const sign = transaction.amount < 0 ? '-' : '+';

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Atualizar saldo
function updateBalance() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  document.getElementById('balance').textContent = `R$ ${total}`;
}

// Remover transação
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Atualizar localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Inicializar app
function init() {
  document.getElementById('transaction-months').innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateBalance();
}

init();

document.getElementById('transaction-form').addEventListener('submit', addTransaction);
