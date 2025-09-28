/**
 * Simple Rich Text Editor
 * Vanilla JavaScript implementation for blog content editing
 */

class RichTextEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.editorId = containerId + '-editor';
        this.init();
    }

    init() {
        this.createEditor();
        this.attachEventListeners();
    }

    createEditor() {
        this.container.innerHTML = `
            <div class="rich-text-editor">
                <div class="editor-toolbar">
                    <button type="button" class="toolbar-btn" data-command="bold" title="Bold">
                        <strong>B</strong>
                    </button>
                    <button type="button" class="toolbar-btn" data-command="italic" title="Italic">
                        <em>I</em>
                    </button>
                    <button type="button" class="toolbar-btn" data-command="underline" title="Underline">
                        <u>U</u>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h2" title="Heading 2">
                        H2
                    </button>
                    <button type="button" class="toolbar-btn" data-command="formatBlock" data-value="h3" title="Heading 3">
                        H3
                    </button>
                    <div class="toolbar-separator"></div>
                    <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">
                        • List
                    </button>
                    <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">
                        1. List
                    </button>
                    <div class="toolbar-separator"></div>
                    <button type="button" class="toolbar-btn" data-command="createLink" title="Insert Link">
                        🔗 Link
                    </button>
                    <button type="button" class="toolbar-btn" data-command="insertImage" title="Insert Image">
                        🖼️ Image
                    </button>
                    <div class="toolbar-separator"></div>
                    <button type="button" class="toolbar-btn" data-command="removeFormat" title="Remove Formatting">
                        Clear
                    </button>
                </div>
                <div class="editor-content" id="${this.editorId}" contenteditable="true" spellcheck="true">
                    <p>Start writing your blog post content here...</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const toolbar = this.container.querySelector('.editor-toolbar');
        const editor = this.container.querySelector('.editor-content');

        // Toolbar button clicks
        toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
                e.preventDefault();
                const command = e.target.dataset.command;
                const value = e.target.dataset.value;
                
                this.executeCommand(command, value);
                editor.focus();
            }
        });

        // Handle special commands
        editor.addEventListener('keydown', (e) => {
            // Handle Enter key for better formatting
            if (e.key === 'Enter') {
                setTimeout(() => {
                    this.formatParagraphs();
                }, 10);
            }
        });

        // Handle paste events
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    executeCommand(command, value = null) {
        if (command === 'createLink') {
            this.createLink();
        } else if (command === 'insertImage') {
            this.insertImage();
        } else {
            document.execCommand(command, false, value);
        }
    }

    createLink() {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    insertImage() {
        // Create file input for image upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
        });
        
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    handleImageUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file is too large. Please select an image smaller than 5MB.');
            return;
        }

        // Create FileReader to convert image to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.alt = 'Blog image';
            img.title = file.name;
            
            // Insert image at cursor position
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
            } else {
                document.execCommand('insertHTML', false, img.outerHTML);
            }
            
            // Focus back to editor
            const editor = this.container.querySelector('.editor-content');
            editor.focus();
        };
        
        reader.readAsDataURL(file);
    }

    formatParagraphs() {
        const editor = this.container.querySelector('.editor-content');
        const paragraphs = editor.querySelectorAll('p');
        
        paragraphs.forEach(p => {
            if (p.innerHTML.trim() === '') {
                p.innerHTML = '<br>';
            }
        });
    }

    getContent() {
        const editor = this.container.querySelector('.editor-content');
        return editor.innerHTML;
    }

    setContent(content) {
        const editor = this.container.querySelector('.editor-content');
        editor.innerHTML = content || '<p>Start writing your blog post content here...</p>';
    }

    isEmpty() {
        const editor = this.container.querySelector('.editor-content');
        const text = editor.textContent.trim();
        return text === '' || text === 'Start writing your blog post content here...';
    }

    focus() {
        const editor = this.container.querySelector('.editor-content');
        editor.focus();
    }
}
