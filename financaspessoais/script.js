let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionsPerPage = 10;
let currentPage = 0;

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransaction(e) {
  e.preventDefault();

  const text = document.getElementById('transaction-text').value.trim();
  const amount = +document.getElementById('transaction-amount').value.trim();
  const category = document.getElementById('transaction-category').value;
  const dateInput = document.getElementById('transaction-date').value;
  const date = new Date(dateInput + '-01'); // Set day to 01

  if (text === '' || isNaN(amount) || isNaN(date.getTime())) {
    alert('Por favor, adicione uma descrição, valor válido e uma data.');
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount,
    category,
    date
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  document.getElementById('transaction-form').reset();
}

function addTransactionDOM(transaction) {
  const list = document.createElement('ul');
  const monthYear = transaction.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

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

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} (${transaction.category}) <span>${sign}R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

function updateBalance() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  document.getElementById('balance').textContent = `R$ ${total}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  document.getElementById('transaction-months').innerHTML = '';
  const paginatedTransactions = transactions.slice(currentPage * transactionsPerPage, (currentPage + 1) * transactionsPerPage);
  paginatedTransactions.forEach(addTransactionDOM);
  updateBalance();
  
  // Show or hide 'Load More' button
  if (transactions.length > (currentPage + 1) * transactionsPerPage) {
    document.getElementById('load-more').style.display = 'block';
  } else {
    document.getElementById('load-more').style.display = 'none';
  }
}

function loadMoreHistory() {
  currentPage++;
  const nextTransactions = transactions.slice(currentPage * transactionsPerPage, (currentPage + 1) * transactionsPerPage);
  nextTransactions.forEach(addTransactionDOM);
  // Hide 'Load More' button if no more transactions
  if (transactions.length <= (currentPage + 1) * transactionsPerPage) {
    document.getElementById('load-more').style.display = 'none';
  }
}

document.getElementById('transaction-form').addEventListener('submit', addTransaction);
document.getElementById('load-more').addEventListener('click', loadMoreHistory);

init();
