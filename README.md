# NoteCraft📝

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-active-success.svg)

**NoteCraft Premium** is a modern, lightweight, and aesthetically pleasing note-taking application built with vanilla JavaScript. It features a "Premium" UI design using glassmorphism, local storage persistence, and advanced features like Markdown support and voice dictation.

No server or database is required—your data lives in your browser.

## ✨ Key Features

### 🎨 UI & UX
* **Premium Design:** Clean interface with glassmorphism effects and smooth transitions.
* **Dark Mode:** Fully supported system-wide dark theme toggle.
* **Responsive:** Works seamlessly on desktops, tablets, and mobile devices.

### ✍️ Editor Capabilities
* **Markdown Support:** Write in Markdown and see it rendered instantly (powered by `marked.js`).
* **Focus Mode:** A distraction-free, full-screen writing experience.
* **Voice Dictation:** Built-in speech-to-text integration (requires Chromium browser).
* **Color Coding:** Organize notes with 7 distinct pastel background colors.

### 🗂️ Organization & Management
* **Pinning:** Keep important notes at the top of the grid.
* **Instant Search:** Filter notes by title or content in real-time.
* **Trash System:** Soft delete notes with the ability to restore them or delete permanently.
* **Data Portability:** Export your notes to JSON and import backups easily.

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3, JavaScript (ES6+).
* **Storage:** Browser `localStorage` (Client-side only).
* **Icons:** [Phosphor Icons](https://phosphoricons.com/).
* **Markdown Parser:** [Marked.js](https://github.com/markedjs/marked).
* **Fonts:** Inter (Google Fonts).

## 🚀 Getting Started

Since NoteCraft is a static web application, no installation or build process is required.

### Prerequisites
A modern web browser (Chrome, Edge, Firefox, Safari).
*Note: Voice Dictation features are currently optimized for Google Chrome.*

### Installation
1.  **Clone or Download** this repository.
2.  Ensure you have the following file structure:
    ```text
    /project-folder
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md
    ```
3.  **Open** `index.html` in your web browser.

## 📂 Project Structure

```text
.
├── index.html    # Main DOM structure, external library links
├── style.css     # CSS Variables, Grid layout, Glassmorphism styles, Dark mode
└── script.js     # State management, LocalStorage logic, UI events
```
## 🎮 Usage Guide

1. **Creating a Note:** Click the "New Note" button or the Floating Action Button (on mobile).
2. **Focus Mode:** Inside a note, click the "Expand/Corners" icon to enter Focus Mode.
3. **Pinning:** Click the push-pin icon inside a note to pin it to the top.
4. **Backup:** Click the Gear icon ⚙️ -> "Export Data" to save a `.json` backup of your notes.

## ⚠️ Browser Compatibility Note

This application uses the **Web Speech API** (`webkitSpeechRecognition`) for the Dictation feature.

* **Supported:** Google Chrome, Microsoft Edge, Brave.
* **Limited/Unsupported:** Firefox (requires config flags), Safari (partial support).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
