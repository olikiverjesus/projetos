document.addEventListener('DOMContentLoaded', function () {
    const categories = ['work', 'personal', 'home'];
    const categoryFilter = document.getElementById('category-filter');
    const notesDisplay = document.getElementById('notes-display');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Atualiza a lista de categorias no select
    function updateCategoryOptions() {
        categoryFilter.innerHTML = '<option value="all">Todas as Categorias</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = capitalizeFirstLetter(category);
            categoryFilter.appendChild(option);
        });
    }

    // Capitaliza a primeira letra de uma string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Adiciona uma nova categoria
    function addCategory() {
        const newCategory = prompt('Digite o nome da nova categoria:');
        if (newCategory && !categories.includes(newCategory.toLowerCase())) {
            categories.push(newCategory.toLowerCase());
            updateCategoryOptions();
        }
    }

    // Salva uma nova nota
    function saveNote() {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-editor').value;
        const category = categoryFilter.value;
        const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());
        const favorite = document.getElementById('favorite-note').checked;

        const note = { title, content, category, tags, favorite, date: new Date().toISOString() };
        localStorage.setItem('note-' + title, JSON.stringify(note));
        displayNotes();
        notifyUser('Nota salva com sucesso!');
    }

    // Exibe as notas salvas
    function displayNotes() {
        notesDisplay.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('note-')) {
                const note = JSON.parse(localStorage.getItem(key));
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <strong>${note.title}</strong> (${note.category}) <br>
                        ${note.content}<br>
                        <em>${note.tags.join(', ')}</em>
                    </div>
                    <div class="note-actions">
                        <button onclick="editNote('${note.title}')">Editar</button>
                        <button onclick="deleteNote('${note.title}')">Excluir</button>
                    </div>
                `;
                notesDisplay.appendChild(li);
            }
        }
    }

    // Edita uma nota
    window.editNote = function (title) {
        const note = JSON.parse(localStorage.getItem('note-' + title));
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-editor').value = note.content;
        document.getElementById('category-filter').value = note.category;
        document.getElementById('note-tags').value = note.tags.join(', ');
        document.getElementById('favorite-note').checked = note.favorite;
    }

    // Exclui uma nota
    window.deleteNote = function (title) {
        if (confirm('Tem certeza que deseja excluir esta nota?')) {
            localStorage.removeItem('note-' + title);
            displayNotes();
        }
    }

    // Compartilha uma nota via email
    function shareNote() {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-editor').value;

        const noteContent = encodeURIComponent(content);
        const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${noteContent}`;
        window.location.href = mailtoLink;
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

    document.getElementById('save-note').addEventListener('click', saveNote);
    document.getElementById('share-note').addEventListener('click', shareNote);
    document.getElementById('add-category').addEventListener('click', addCategory);

    updateCategoryOptions();
    displayNotes();
});
