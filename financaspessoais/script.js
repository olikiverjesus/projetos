document.addEventListener('DOMContentLoaded', function () {
  const subscriptions = [];
  const expenses = [];
  const subscriptionNameInput = document.getElementById('subscription-name');
  const subscriptionCostInput = document.getElementById('subscription-cost');
  const subscriptionDateInput = document.getElementById('subscription-date');
  const expenseCategoryInput = document.getElementById('expense-category');
  const expenseAmountInput = document.getElementById('expense-amount');
  const expenseDateInput = document.getElementById('expense-date');
  const reminderDateInput = document.getElementById('reminder-date');
  const monthlySummary = document.getElementById('monthly-summary');
  const transactionsHistory = document.getElementById('transactions-history');
  const loadMoreButton = document.getElementById('load-more');
  const expensesChart = document.getElementById('expenses-chart');
  const themeToggle = document.getElementById('theme-toggle');

  // Adiciona uma assinatura
  document.getElementById('add-subscription').addEventListener('click', function () {
      const name = subscriptionNameInput.value;
      const cost = parseFloat(subscriptionCostInput.value);
      const date = new Date(subscriptionDateInput.value).toLocaleDateString();

      if (name && !isNaN(cost)) {
          const subscription = { name, cost, date };
          subscriptions.push(subscription);
          displaySummary();
          displayTransactions();
          notifyUser('Assinatura adicionada com sucesso!');
      }
  });

  // Adiciona um gasto
  document.getElementById('add-expense').addEventListener('click', function () {
      const category = expenseCategoryInput.value;
      const amount = parseFloat(expenseAmountInput.value);
      const date = new Date(expenseDateInput.value).toLocaleDateString();

      if (category && !isNaN(amount)) {
          const expense = { category, amount, date };
          expenses.push(expense);
          displaySummary();
          displayTransactions();
          updateChart();
          notifyUser('Gasto adicionado com sucesso!');
      }
  });

  // Adiciona um lembrete
  document.getElementById('add-reminder').addEventListener('click', function () {
      const date = new Date(reminderDateInput.value).toLocaleDateString();
      notifyUser(`Lembrete adicionado para ${date}!`);
  });

  // Exibe o resumo mensal
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

  // Exibe as transações
  function displayTransactions() {
      transactionsHistory.innerHTML = '';
      [...subscriptions, ...expenses].forEach(transaction => {
          const li = document.createElement('li');
          li.textContent = `${transaction.date} - ${transaction.name || transaction.category} - R$ ${transaction.cost || transaction.amount}`;
          transactionsHistory.appendChild(li);
      });
  }

  // Atualiza o gráfico de despesas
  function updateChart() {
      const ctx = expensesChart.getContext('2d');
      const categories = [...new Set(expenses.map(exp => exp.category))];
      const data = categories.map(cat => {
          return expenses
              .filter(exp => exp.category === cat)
              .reduce((sum, exp) => sum + exp.amount, 0);
      });

      new Chart(ctx, {
          type: 'pie',
          data: {
              labels: categories,
              datasets: [{
                  data: data,
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  tooltip: {
                      callbacks: {
                          label: function(tooltipItem) {
                              return `${tooltipItem.label}: R$ ${tooltipItem.raw.toFixed(2)}`;
                          }
                      }
                  }
              }
          }
      });
  }

  // Alternar tema
  themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
  });

  // Notificar o usuário
  function notifyUser(message) {
      alert(message);
  }
});
