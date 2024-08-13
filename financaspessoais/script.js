// Função para adicionar transação
function adicionarTransacao() {
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value;

  if (!descricao || isNaN(valor)) {
    alert('Por favor, insira uma descrição válida e um valor.');
    return;
  }

  // Salvar transação no Local Storage
  let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  transacoes.push({ descricao, valor, tipo });
  localStorage.setItem('transacoes', JSON.stringify(transacoes));

  // Atualizar visualização das transações e resumo
  atualizarTransacoes();
  atualizarResumo();

  // Limpar campos de entrada
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('tipo').value = 'entrada';
}

// Função para atualizar visualização das transações
function atualizarTransacoes() {
  const transacoesContainer = document.getElementById('transacoes');
  transacoesContainer.innerHTML = '';

  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  transacoes.forEach(transacao => {
    const transacaoElement = document.createElement('div');
    transacaoElement.classList.add('transacao', transacao.tipo);
    transacaoElement.innerHTML = `<strong>${transacao.descricao}</strong> - R$ ${transacao.valor.toFixed(2)}`;
    transacoesContainer.appendChild(transacaoElement);
  });
}

// Função para atualizar o resumo financeiro
function atualizarResumo() {
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  let totalEntradas = 0;
  let totalSaidas = 0;

  transacoes.forEach(transacao => {
    if (transacao.tipo === 'entrada') {
      totalEntradas += transacao.valor;
    } else {
      totalSaidas += transacao.valor;
    }
  });

  const saldo = totalEntradas - totalSaidas;

  document.getElementById('total-entradas').textContent = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById('total-saidas').textContent = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById('saldo').textContent = `R$ ${saldo.toFixed(2)}`;
}

// Inicializar visualização das transações e resumo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  atualizarTransacoes();
  atualizarResumo();
});
