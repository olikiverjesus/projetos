const API_KEY = 'YOUR_API_KEY'; // Substitua com sua chave da API
const API_URL = `https://api.exchangerate-api.com/v4/latest/BRL`; // API base URL

let rates = {};

async function fetchRates() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    rates = data.rates;
    
    // Adicione EUR e BRL se não estiverem presentes
    if (!rates.EUR) {
      console.warn('Euro (EUR) não disponível na API');
    }
    if (!rates.BRL) {
      console.warn('Real (BRL) não disponível na API');
    }

    localStorage.setItem('rates', JSON.stringify(rates));
    populateCurrencyOptions();
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error);
  }
}

function populateCurrencyOptions() {
  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');

  fromCurrencySelect.innerHTML = '';
  toCurrencySelect.innerHTML = '';

  Object.keys(rates).forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromCurrencySelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency;
    optionTo.textContent = currency;
    toCurrencySelect.appendChild(optionTo);
  });
}

function convertCurrency(amount, fromCurrency, toCurrency) {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    alert('Moeda não disponível');
    return '0.00';
  }
  const rate = rates[toCurrency] / rates[fromCurrency];
  return (amount * rate).toFixed(2);
}

function handleConversion(e) {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  
  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, insira um valor válido.');
    return;
  }

  const result = convertCurrency(amount, fromCurrency, toCurrency);
  document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
}

document.getElementById('converter-form').addEventListener('submit', handleConversion);
document.getElementById('update-rates').addEventListener('click', fetchRates);

// Inicializar
const savedRates = JSON.parse(localStorage.getItem('rates'));
if (savedRates) {
  rates = savedRates;
  populateCurrencyOptions();
} else {
  fetchRates();
}

// Atualizar taxas diariamente
setInterval(fetchRates, 24 * 60 * 60 * 1000); // 24 horas em milissegundos
