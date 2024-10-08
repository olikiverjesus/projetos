document.addEventListener('DOMContentLoaded', function() {
  const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  let transactionsHistoryLimit = 10;

  const monthlySummary = document.getElementById('monthly-summary');
  const transactionsHistory = document.getElementById('transactions-history');
  const expensesChart = document.getElementById('expenses-chart');
  const themeToggle = document.getElementById('theme-toggle');
  const loadMoreButton = document.getElementById('load-more');
  
  // Initialize
  displaySummary();
  displayTransactions();
  updateChart();

  document.getElementById('add-income').addEventListener('click', function() {
      const name = document.getElementById('income-name').value;
      const amount = parseFloat(document.getElementById('income-amount').value);
      const month = document.getElementById('income-month').value;
      if (name && !isNaN(amount) && month) {
          incomes.push({ name, amount, date: new Date().toLocaleDateString(), month });
          localStorage.setItem('incomes', JSON.stringify(incomes));
          displaySummary();
          displayTransactions();
      }
  });

  document.getElementById('add-expense').addEventListener('click', function() {
      const name = document.getElementById('expense-name').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const category = document.getElementById('expense-category').value;
      const month = document.getElementById('expense-month').value;
      if (name && !isNaN(amount) && category && month) {
          expenses.push({ name, amount, category, date: new Date().toLocaleDateString(), month });
          localStorage.setItem('expenses', JSON.stringify(expenses));
          displaySummary();
          displayTransactions();
          updateChart();
      }
  });

  // Other event listeners ...

  function displaySummary() {
      let totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
      let totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

      const balance = totalIncome - totalExpenses;

      monthlySummary.innerHTML = `
          <p>Saldo Atual: R$ ${balance.toFixed(2)}</p>
          <p>Ganhos do Mês: R$ ${totalIncome.toFixed(2)}</p>
          <p>Gastos do Mês: R$ ${totalExpenses.toFixed(2)}</p>
      `;
  }

  function displayTransactions() {
      transactionsHistory.innerHTML = '';
      const allTransactions = [...incomes, ...expenses];
      const transactionsToDisplay = allTransactions.slice(-transactionsHistoryLimit);

      transactionsToDisplay.forEach(transaction => {
          const li = document.createElement('li');
          li.innerHTML = `
              <span>${transaction.date} ${transaction.name} (${transaction.month})</span>
              <span>${transaction.amount ? '-' : '+'} R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
              <button class="remove-transaction">x</button>
          `;
          transactionsHistory.appendChild(li);
      });

      if (allTransactions.length > transactionsHistoryLimit) {
          loadMoreButton.style.display = 'block';
      } else {
          loadMoreButton.style.display = 'none';
      }

      const removeButtons = document.querySelectorAll('.remove-transaction');
      removeButtons.forEach(button => {
          button.addEventListener('click', function() {
              const transaction = this.parentElement;
              const name = transaction.querySelector('span').textContent.split(' ')[1];
              const amount = parseFloat(transaction.querySelector('span').textContent.split('R$ ')[1]);

              // Remove transaction from arrays
              const indexIncomes = incomes.findIndex(inc => inc.name === name && inc.amount === amount);
              if (indexIncomes !== -1) {
                  incomes.splice(indexIncomes, 1);
                  localStorage.setItem('incomes', JSON.stringify(incomes));
              } else {
                  const indexExpenses = expenses.findIndex(exp => exp.name === name && exp.amount === amount);
                  if (indexExpenses !== -1) {
                      expenses.splice(indexExpenses, 1);
                      localStorage.setItem('expenses', JSON.stringify(expenses));
                  }
              }

              displaySummary();
              displayTransactions();
              updateChart();
          });
      });
  }

  function updateChart() {
      const ctx = expensesChart.getContext('2d');
      const categoriesData = {};
      
      expenses.forEach(exp => {
          categoriesData[exp.category] = (categoriesData[exp.category] || 0) + exp.amount;
      });

      const labels = Object.keys(categoriesData);
      const data = Object.values(categoriesData);

      if (window.chart) {
          window.chart.destroy();
      }

      window.chart = new Chart(ctx, {
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
      const data = JSON.stringify({ incomes, expenses });
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
              localStorage.setItem('incomes', JSON.stringify(data.incomes));
              localStorage.setItem('expenses', JSON.stringify(data.expenses));
              localStorage.setItem('categories', JSON.stringify(data.categories));
              incomes.length = 0;
              expenses.length = 0;
              categories.length = 0;
              incomes.push(...data.incomes);
              expenses.push(...data.expenses);
              categories.push(...data.categories);
              displaySummary();
              displayTransactions();
              updateChart();
          };
          reader.readAsText(file);
      }
  }

  function notifyUser(message) {
      alert(message);
  }

  loadMoreButton.addEventListener('click', function() {
      transactionsHistoryLimit += 10;
      displayTransactions();
  });
});
