// script.js

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNote = '';

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note.title || `Nota sem título (${index + 1})`;
        li.addEventListener('click', () => loadNote(index));
        notesList.appendChild(li);
    });
}

function saveNote() {
    const noteContent = document.getElementById('note-editor').value;
    const title = noteContent.split('\n')[0]; // Primeiro título como título da nota
    if (currentNote === '') {
        // Nova nota
        notes.push({ title, content: noteContent });
    } else {
        // Editando nota existente
        notes[currentNote].content = noteContent;
        notes[currentNote].title = title;
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
}

function loadNote(index) {
    currentNote = index;
    const note = notes[index];
    document.getElementById('note-editor').value = note.content;
    renderMarkdown(note.content);
}

function newNote() {
    currentNote = '';
    document.getElementById('note-editor').value = '';
}

function renderMarkdown(content) {
    // Renderiza Markdown usando um parser, por exemplo, o `marked.js`
    document.getElementById('preview').innerHTML = marked(content);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

document.getElementById('note-editor').addEventListener('input', () => {
    renderMarkdown(document.getElementById('note-editor').value);
    saveNote();
});

document.getElementById('new-note').addEventListener('click', newNote);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

renderNotesList();
