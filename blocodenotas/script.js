// script.js

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteIndex = null;

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note.title || `Nota sem título (${index + 1})`;
        li.addEventListener('click', () => loadNoteForView(index));
        notesList.appendChild(li);
    });
}

function saveNote() {
    const noteContent = document.getElementById('note-editor').value;
    const title = noteContent.split('\n')[0] || "Nota sem título";

    if (currentNoteIndex !== null) {
        notes[currentNoteIndex].content = noteContent;
        notes[currentNoteIndex].title = title;
    } else {
        notes.push({ title, content: noteContent });
        currentNoteIndex = notes.length - 1;
    }
    
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotesList();
    newNote(); // Clear editor after saving
}

function loadNoteForView(index) {
    currentNoteIndex = index;
    const note = notes[index];
    document.getElementById('note-editor').value = note.content;
    renderMarkdown(note.content);
}

function newNote() {
    currentNoteIndex = null;
    document.getElementById('note-editor').value = '';
    document.getElementById('preview').innerHTML = '';
}

function deleteNote() {
    if (currentNoteIndex !== null) {
        notes.splice(currentNoteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        newNote();
        renderNotesList();
    }
}

function renderMarkdown(content) {
    document.getElementById('preview').innerHTML = marked(content);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

document.getElementById('note-editor').addEventListener('input', () => {
    renderMarkdown(document.getElementById('note-editor').value);
});

document.getElementById('save-note').addEventListener('click', saveNote);
document.getElementById('new-note').addEventListener('click', newNote);
document.getElementById('delete-note').addEventListener('click', deleteNote);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

renderNotesList();
