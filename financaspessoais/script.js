// script.js

document.addEventListener('DOMContentLoaded', function() {
  const subscriptions = [];
  const expenses = [];

  const monthlySummary = document.getElementById('monthly-summary');
  const transactionsHistory = document.getElementById('transactions-history');
  const expensesChart = document.getElementById('expenses-chart');
  const themeToggle = document.getElementById('theme-toggle');

  document.getElementById('add-subscription').addEventListener('click', function() {
      const name = document.getElementById('subscription-name').value;
      const cost = parseFloat(document.getElementById('subscription-cost').value);
      if (name && !isNaN(cost)) {
          subscriptions.push({ name, cost, date: new Date().toLocaleDateString() });
          displaySummary();
          displayTransactions();
      }
  });

  document.getElementById('add-expense').addEventListener('click', function() {
      const name = document.getElementById('expense-name').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const category = document.getElementById('expense-category').value;
      if (name && !isNaN(amount)) {
          expenses.push({ name, amount, category, date: new Date().toLocaleDateString() });
          displaySummary();
          displayTransactions();
          updateChart();
      }
  });

  document.getElementById('add-category').addEventListener('click', function() {
      const newCategory = document.getElementById('new-category').value;
      if (newCategory) {
          const li = document.createElement('li');
          li.textContent = newCategory;
          document.getElementById('category-list').appendChild(li);
          document.getElementById('new-category').value = '';
      }
  });

  document.getElementById('download-data').addEventListener('click', downloadData);
  document.getElementById('upload-data').addEventListener('change', uploadData);

  document.getElementById('add-reminder').addEventListener('click', function() {
      const reminderDateInput = document.getElementById('reminder-date');
      const date = new Date(reminderDateInput.value).toLocaleDateString();
      notifyUser(`Lembrete adicionado para ${date}!`);
  });

  function displaySummary() {
      let totalIncome = 0;
      let totalExpenses = 0;

      subscriptions.forEach(sub => totalIncome += sub.cost);
      expenses.forEach(exp => totalExpenses += exp.amount);

      const balance = totalIncome - totalExpenses;

      monthlySummary.innerHTML = `
          <p><strong>Renda Total:</strong> R$ ${totalIncome.toFixed(2)}</p>
          <p><strong>Gastos Totais:</strong> R$ ${totalExpenses.toFixed(2)}</p>
          <p><strong>Saldo Atual:</strong> R$ ${balance.toFixed(2)}</p>
      `;
  }

  function displayTransactions() {
      transactionsHistory.innerHTML = '';
      [...subscriptions, ...expenses].forEach(transaction => {
          const li = document.createElement('li');
          li.innerHTML = `
              <span>${transaction.date} ${transaction.name}</span>
              <span>${transaction.amount ? '-' : '+'} R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
              <button class="remove-transaction">x</button>
          `;
          transactionsHistory.appendChild(li);
      });
      const removeButtons = document.querySelectorAll('.remove-transaction');
      removeButtons.forEach(button => {
          button.addEventListener('click', function() {
              const transaction = this.parentElement;
              const name = transaction.querySelector('span').textContent.split(' ')[1];
              const amount = parseFloat(transaction.querySelector('span').textContent.split('R$ ')[1]);

              // Remove transaction from arrays
              subscriptions.splice(subscriptions.findIndex(sub => sub.name === name && sub.cost === amount), 1);
              expenses.splice(expenses.findIndex(exp => exp.name === name && exp.amount === amount), 1);

              displaySummary();
              displayTransactions();
              updateChart();
          });
      });
  }

  function updateChart() {
      const ctx = expensesChart.getContext('2d');
      const categories = {};
      
      expenses.forEach(exp => {
          categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
      });

      const labels = Object.keys(categories);
      const data = Object.values(categories);

      new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Despesas por Categoria',
                  data: data,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  }

  function downloadData() {
      const data = JSON.stringify({ subscriptions, expenses });
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup.json';
      a.click();
      URL.revokeObjectURL(url);
  }

  function uploadData(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              const data = JSON.parse(e.target.result);
              subscriptions.length = 0;
              expenses.length = 0;
              subscriptions.push(...data.subscriptions);
              expenses.push(...data.expenses);
              displaySummary();
              displayTransactions();
              updateChart();
          };
          reader.readAsText(file);
      }
  }

  themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
  });

  // Inicializar o gráfico
  updateChart();
});
