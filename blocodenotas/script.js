document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
});

document.getElementById('bold-btn').addEventListener('click', function() {
    document.execCommand('bold');
});

document.getElementById('bullet-btn').addEventListener('click', function() {
    document.execCommand('insertUnorderedList');
});

// Função para salvar as notas
document.getElementById('save-note').addEventListener('click', function() {
    let title = document.getElementById('note-title').value;
    let content = document.getElementById('note-editor').value;
    
    if (title && content) {
        // Salvar no armazenamento local
        localStorage.setItem(title, content);
        alert('Nota salva!');
    } else {
        alert('Título e conteúdo são obrigatórios.');
    }
});

// Carrega as notas do armazenamento local na inicialização
window.onload = function() {
    let notesList = document.getElementById('notes-list');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let noteItem = document.createElement('li');
        noteItem.textContent = key;
        notesList.appendChild(noteItem);
    }
};

// Função para excluir a nota selecionada
document.getElementById('delete-note').addEventListener('click', function() {
    let title = document.getElementById('note-title').value;
    localStorage.removeItem(title);
    alert('Nota excluída!');
});
