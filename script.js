/* --- DATA & STATE --- */
const colors = ['#ffffff', '#fecaca', '#fde68a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#cbd5e1'];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentView = 'notes'; 
let activeIndex = null;
let activeColor = colors[0];
let isPinned = false;

/* --- DOM ELEMENTS --- */
const grid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("noteModal");
const modalCard = document.getElementById("modalCard");
const backdrop = document.getElementById("modalBackdrop");
const searchInput = document.getElementById("searchInput");

// Modal Inputs
const viewMode = document.getElementById("viewMode");
const editMode = document.getElementById("editMode");
const viewTitle = document.getElementById("viewTitle");
const viewContent = document.getElementById("viewContent");
const editTitle = document.getElementById("editTitle");
const editContent = document.getElementById("editContent");

// Tools
const pinTool = document.getElementById("pinTool");
const micTool = document.getElementById("micTool");
const saveAction = document.getElementById("saveAction");
const editAction = document.getElementById("editAction");
const deleteAction = document.getElementById("deleteAction");
const restoreAction = document.getElementById("restoreAction");
const focusTool = document.getElementById("focusTool");
const closeFocusBtn = document.getElementById("closeFocusBtn");

/* --- INITIALIZATION --- */
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeBtn').querySelector('i').className = 'ph-bold ph-sun';
}

const picker = document.querySelector(".color-picker");
colors.forEach(c => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.style.background = c;
    btn.onclick = () => { activeColor = c; updateModalStyle(); };
    picker.appendChild(btn);
});

render();

/* --- CORE LOGIC --- */
function switchView(view) {
    currentView = view;
    document.getElementById("trashBtn").classList.toggle('active', view === 'trash');
    document.getElementById("pageTitle").textContent = view === 'trash' ? "Trash" : "Your Notes";
    view === 'trash' ? document.getElementById("viewBadge").classList.remove('hidden') : document.getElementById("viewBadge").classList.add('hidden');
    render();
}

function render() {
    grid.innerHTML = "";
    const term = searchInput.value.toLowerCase();

    let filtered = notes.map((n, i) => ({...n, originalIndex: i}))
        .filter(n => {
            const matches = (n.title + n.content).toLowerCase().includes(term);
            if (currentView === 'trash') return n.isDeleted && matches;
            return !n.isDeleted && matches;
        });

    if(currentView === 'notes') {
        filtered.sort((a, b) => (a.pinned === b.pinned) ? 0 : a.pinned ? -1 : 1);
    }

    if(filtered.length === 0) {
        emptyState.classList.remove("hidden");
        emptyState.querySelector('h3').textContent = currentView === 'trash' ? "Trash is empty" : "No notes found";
    } else {
        emptyState.classList.add("hidden");
    }

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = "note";
        card.style.background = note.color;
        
        // Border adjustment
        if (note.color === '#ffffff' && !document.body.classList.contains('dark-mode')) {
            card.style.border = '1px solid #e5e7eb';
        } else {
            card.style.border = '1px solid transparent';
        }

        if(note.pinned && currentView === 'notes') {
            card.innerHTML += `<div class="pin-badge"><i class="ph-fill ph-push-pin"></i></div>`;
        }

        const textPreview = note.content.replace(/[#*`_]/g, '');

        card.innerHTML += `
            <h3>${note.title || "Untitled"}</h3>
            <p>${textPreview || "Empty note..."}</p>
            <div class="note-date">${new Date(note.updatedAt).toLocaleDateString()}</div>
        `;
        
        card.onclick = () => openNote(note.originalIndex);
        grid.appendChild(card);
    });
}

/* --- MODAL --- */
function openNote(index) {
    activeIndex = index;
    const note = notes[index];
    activeColor = note.color;
    isPinned = note.pinned || false;

    viewTitle.textContent = note.title || "Untitled";
    viewContent.innerHTML = marked.parse(note.content || "");
    
    editTitle.value = note.title;
    editContent.value = note.content;

    updateModalStyle();
    updatePinTool();

    if (note.isDeleted) {
        toggleMode('view');
        editAction.classList.add('hidden');
        saveAction.classList.add('hidden');
        restoreAction.classList.remove('hidden');
        pinTool.classList.add('hidden');
    } else {
        toggleMode('view');
        editAction.classList.remove('hidden');
        restoreAction.classList.add('hidden');
        pinTool.classList.remove('hidden');
    }
    modal.classList.add("active");
}

function createNote() {
    activeIndex = null;
    activeColor = '#ffffff'; 
    isPinned = false;
    editTitle.value = "";
    editContent.value = "";
    updateModalStyle();
    updatePinTool();
    toggleMode('edit');
    modal.classList.add("active");
}

function toggleMode(mode) {
    if(mode === 'edit') {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        editAction.classList.add('hidden');
        saveAction.classList.remove('hidden');
        micTool.classList.remove('hidden');
    } else {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
        editAction.classList.remove('hidden');
        saveAction.classList.add('hidden');
        micTool.classList.add('hidden');
    }
}

function updateModalStyle() {
    modalCard.style.background = activeColor;
    document.querySelectorAll(".color-btn").forEach(b => {
        b.classList.toggle("selected", b.style.background === activeColor);
    });
}

function updatePinTool() { pinTool.classList.toggle('active', isPinned); }

function save() {
    const title = editTitle.value.trim();
    const content = editContent.value.trim();
    if(!title && !content) { modal.classList.remove("active"); modal.classList.remove("focus-mode"); return; }
    const noteObj = {
        title, content, color: activeColor, pinned: isPinned,
        isDeleted: false, updatedAt: new Date().toISOString()
    };
    if(activeIndex === null) notes.unshift(noteObj);
    else notes[activeIndex] = {...notes[activeIndex], ...noteObj};
    localStorage.setItem("notes", JSON.stringify(notes));
    render();
    modal.classList.remove("active");
    modal.classList.remove("focus-mode"); // Reset Focus
}

/* --- EVENTS --- */
document.getElementById("newNoteBtn").onclick = createNote;
document.getElementById("fabBtn").onclick = createNote;
document.getElementById("trashBtn").onclick = () => switchView(currentView === 'notes' ? 'trash' : 'notes');

document.getElementById("closeTool").onclick = () => {
    modal.classList.remove("active");
    modal.classList.remove("focus-mode");
};
backdrop.onclick = () => {
    modal.classList.remove("active");
    modal.classList.remove("focus-mode");
};
saveAction.onclick = save;
editAction.onclick = () => toggleMode('edit');

// Focus Mode Toggle
focusTool.onclick = () => modal.classList.add("focus-mode");
closeFocusBtn.onclick = () => modal.classList.remove("focus-mode");

pinTool.onclick = () => {
    isPinned = !isPinned;
    updatePinTool();
    if(activeIndex !== null) {
        notes[activeIndex].pinned = isPinned;
        localStorage.setItem("notes", JSON.stringify(notes));
        render();
    }
};

deleteAction.onclick = () => {
    if(activeIndex === null) { modal.classList.remove("active"); return; }
    if(notes[activeIndex].isDeleted) {
        if(confirm("Delete strictly forever?")) notes.splice(activeIndex, 1);
    } else {
        notes[activeIndex].isDeleted = true;
        notes[activeIndex].pinned = false;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    render();
    modal.classList.remove("active");
};

restoreAction.onclick = () => {
    if(activeIndex !== null) {
        notes[activeIndex].isDeleted = false;
        localStorage.setItem("notes", JSON.stringify(notes));
        render();
        modal.classList.remove("active");
    }
};

document.getElementById("themeBtn").onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById("themeBtn").querySelector('i').className = isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    render(); 
};

micTool.onclick = () => {
    if (!('webkitSpeechRecognition' in window)) { alert("Use Chrome for Voice."); return; }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    micTool.style.color = 'red';
    recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        editContent.value += (editContent.value ? " " : "") + text;
        micTool.style.color = '';
    };
    recognition.onerror = () => micTool.style.color = '';
    recognition.start();
};

/* --- DATA EXPORT/IMPORT --- */
document.getElementById("settingsBtn").onclick = () => {
    document.getElementById("dropdownMenu").classList.toggle("show");
};
window.onclick = (e) => {
    if (!e.target.matches('.btn-icon-nav') && !e.target.closest('.btn-icon-nav')) {
        document.getElementById("dropdownMenu").classList.remove('show');
    }
}

document.getElementById("exportBtn").onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "notecraft_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

document.getElementById("importInput").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedNotes = JSON.parse(e.target.result);
            if (Array.isArray(importedNotes)) {
                if (confirm("Replace current notes with imported backup?")) {
                    notes = importedNotes;
                    localStorage.setItem("notes", JSON.stringify(notes));
                    render();
                }
            } else { alert("Invalid file format."); }
        } catch (err) { alert("Error reading file."); }
    };
    reader.readAsText(file);
};

searchInput.oninput = render;