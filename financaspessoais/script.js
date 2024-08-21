document.addEventListener('DOMContentLoaded', function () {
  const subscriptions = [];
  const expenses = [];
  const subscriptionNameInput = document.getElementById('subscription-name');
  const subscriptionCostInput = document.getElementById('subscription-cost');
  const subscriptionDateInput = document.getElementById('subscription-date');
  const expenseCategoryInput = document.getElementById('expense-category');
  const expenseAmountInput = document.getElementById('expense-amount');
  const expenseDateInput = document.getElementById('expense-date');
  const monthlySummary = document.getElementById('monthly-summary');
  const transactionsHistory = document.getElementById('transactions-history');
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
          notifyUser('Gasto adicionado com sucesso!');
      }
  });

  // Exibe o resumo mensal
  function displaySummary() {
      let totalSubscriptions = 0;
      let totalExpenses = 0;

      subscriptions.forEach(sub => totalSubscriptions += sub.cost);
      expenses.forEach(exp => totalExpenses += exp.amount);

      monthlySummary.innerHTML = `
          <p><strong>Total de Assinaturas:</strong> R$ ${totalSubscriptions.toFixed(2)}</p>
          <p><strong>Total de Gastos:</strong> R$ ${totalExpenses.toFixed(2)}</p>
          <p><strong>Saldo Atual:</strong> R$ ${(totalSubscriptions - totalExpenses).toFixed(2)}</p>
      `;
  }

  // Exibe o histórico de transações
  function displayTransactions() {
      transactionsHistory.innerHTML = '';
      [...subscriptions, ...expenses].forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.date}: ${item.name || item.category} - R$ ${item.cost || item.amount.toFixed(2)}`;
          transactionsHistory.appendChild(li);
      });
  }

  // Notifica o usuário
  function notifyUser(message) {
      if (Notification.permission === "granted") {
          new Notification(message);
      } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                  new Notification(message);
              }
          });
      }
  }

  // Alterna o tema da aplicação
  themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
  });
});
