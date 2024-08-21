let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteIndex = null;

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    notesList.innerHTML = '';
    notes
        .filter(note => 
            (categoryFilter === '' || note.category === categoryFilter) &&
            (note.title.toLowerCase().includes(searchQuery) || note.content.toLowerCase().includes(searchQuery))
        )
        .forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note.title || `Nota sem título (${index + 1})`;
            li.addEventListener('click', () => loadNoteForView(index));
            li.className = note.completed ? 'completed' : '';
            notesList.appendChild(li);
        });
}

function saveNote() {
    const noteContent = document.getElementById('note-editor').value;
    const noteTitle = document.getElementById('note-title').value;
    const title = noteTitle || noteContent.split('\n')[0] || "Nota sem título";

    if (currentNoteIndex !== null) {
        notes[currentNoteIndex].content = noteContent;
        notes[currentNoteIndex].title = title;
    } else {
        notes.push({ title, content: noteContent, category: document.getElementById('category-filter').value, completed: false });
        currentNoteIndex = notes.length - 1;
    }
    
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
    newNote(); // Clear editor after saving
}

function toggleCompletion() {
    if (currentNoteIndex !== null) {
        notes[currentNoteIndex].completed = !notes[currentNoteIndex].completed;
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotesList();
    }
}

/* Adicionar as funções existentes e novas */
