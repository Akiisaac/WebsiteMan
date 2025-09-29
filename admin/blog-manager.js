/**
 * Blog Post Management System
 * Handles blog post creation, editing, and management
 */

class BlogPostManager {
    constructor() {
        this.currentPost = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        // Don't auto-show create form - let auth system handle it
    }

    showCreateForm(editPost = null) {
        const isEditing = editPost !== null;
        const headerTitle = isEditing ? 'Edit Blog Post' : 'Create New Blog Post';
        
        const container = document.getElementById('admin-container');
        container.innerHTML = `
            <div class="admin-panel">
                <header class="admin-header">
                    <h1>${headerTitle}</h1>
                    <div class="header-actions">
                        <button id="back-to-dashboard" class="btn btn-secondary">← Dashboard</button>
                        <button id="logout-btn" class="btn btn-secondary">Logout</button>
                    </div>
                </header>
                
                <main class="admin-content">
                    <form id="blog-post-form" class="blog-form">
                        
                        <!-- Left Column: Basic Info & Content -->
                        <div class="form-column-left">
                            
                            <!-- Basic Information Card -->
                            <div class="form-card">
                                <div class="card-header">
                                    <h2>Basic Information</h2>
                                </div>
                                <div class="card-content">
                                    <div class="form-group">
                                        <label for="post-title">Title *</label>
                                        <input type="text" id="post-title" name="title" required placeholder="Enter blog post title" value="${isEditing ? editPost.title : ''}">
                                    </div>

                                    <div class="form-group">
                                        <label for="post-summary">Summary/Excerpt *</label>
                                        <textarea id="post-summary" name="summary" rows="4" required placeholder="Brief description of the post content">${isEditing ? editPost.summary : ''}</textarea>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="post-date">Publication Date *</label>
                                            <input type="date" id="post-date" name="date" required value="${isEditing ? editPost.publicationDate : ''}">
                                        </div>
                                        <div class="form-group">
                                            <label for="post-status">Status</label>
                                            <select id="post-status" name="status">
                                                <option value="published" selected>Published</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="post-tags">Tags/Categories</label>
                                        <input type="text" id="post-tags" name="tags" placeholder="research, ecology, pest-management (comma-separated)" value="${isEditing ? editPost.tags : ''}">
                                    </div>
                                </div>
                            </div>

                            <!-- Content Card -->
                            <div class="form-card">
                                <div class="card-header">
                                    <h2>Content</h2>
                                </div>
                                <div class="card-content">
                                    <div class="form-group">
                                        <label for="post-content">Full Content *</label>
                                        <button type="button" id="open-content-editor" class="btn btn-primary content-editor-btn">
                                            📝 Open Content Editor
                                        </button>
                                        <div id="content-preview" class="content-preview">
                                            ${isEditing && editPost.content ? editPost.content : '<em>No content added yet</em>'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Right Column: Media & Links -->
                        <div class="form-column-right">
                            
                            <!-- Images Card -->
                            <div class="form-card">
                                <div class="card-header">
                                    <h2>Images</h2>
                                </div>
                                <div class="card-content">
                                    <div class="form-group">
                                        <label for="post-thumbnail">Thumbnail Image</label>
                                        ${isEditing && editPost.thumbnail ? `
                                            <div class="current-thumbnail">
                                                <img src="${editPost.thumbnail}" alt="Current thumbnail" style="max-width: 200px; margin: 10px 0;">
                                                <div>Current thumbnail (leave empty to keep)</div>
                                            </div>
                                        ` : ''}
                                        <input type="file" id="post-thumbnail" name="thumbnail" accept="image/*">
                                        <small class="form-help">Main image displayed on blog menu</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="post-images">Content Images</label>
                                        <input type="file" id="post-images" name="images" accept="image/*" multiple>
                                        <small class="form-help">Images embedded in the content</small>
                                    </div>
                                </div>
                            </div>

                            <!-- External Links Card -->
                            <div class="form-card">
                                <div class="card-header">
                                    <h2>External Links</h2>
                                </div>
                                <div class="card-content">
                                    <div class="form-group">
                                        <label for="post-external-link">Paper/Research Link</label>
                                        <input type="url" id="post-external-link" name="externalLink" placeholder="https://example.com/paper" value="${isEditing ? editPost.externalLink || '' : ''}">
                                        <small class="form-help">Link to full research paper or external resource</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions Card -->
                            <div class="form-card">
                                <div class="card-header">
                                    <h2>Actions</h2>
                                </div>
                                <div class="card-content">
                                    <div class="form-actions">
                                        <button type="button" id="preview-btn" class="btn btn-secondary">👁️ Preview</button>
                                        <button type="submit" class="btn btn-primary">💾 ${isEditing ? 'Update Post' : 'Save Post'}</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </form>
                </main>
            </div>
        `;

        this.attachEventListeners();
        this.setDefaultDate();
        this.initRichTextEditor();
        
        // Set current post for editing
        if (isEditing) {
            this.currentPost = editPost;
            this.isEditing = true;
        } else {
            this.currentPost = null;
            this.isEditing = false;
        }
    }

    attachEventListeners() {
        // Back to dashboard
        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            this.showAdminDashboard();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            window.adminAuth.logout();
        });

        // Form submission
        document.getElementById('blog-post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        // Open content editor
        document.getElementById('open-content-editor').addEventListener('click', () => {
            this.openContentEditor();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('post-date').value = today;
    }

    initRichTextEditor() {
        // Initialize rich text editor in modal (will be created when modal opens)
        this.richTextEditor = null;
    }

    openContentEditor() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'content-editor-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Content Editor</h2>
                        <button type="button" class="modal-close" id="close-content-editor">×</button>
                    </div>
                    <div class="modal-body">
                        <div id="post-content"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-content">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-content">Save Content</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize rich text editor in modal
        this.richTextEditor = new RichTextEditor('post-content');
        
        // Load existing content if any
        const existingContent = document.getElementById('content-preview').innerHTML;
        if (existingContent && existingContent !== '') {
            this.richTextEditor.setContent(existingContent);
        }

        // Focus on editor
        setTimeout(() => {
            this.richTextEditor.focus();
        }, 100);

        // Attach modal event listeners
        document.getElementById('close-content-editor').addEventListener('click', () => {
            this.closeContentEditor();
        });

        document.getElementById('cancel-content').addEventListener('click', () => {
            this.closeContentEditor();
        });

        document.getElementById('save-content').addEventListener('click', () => {
            this.saveContent();
        });

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeContentEditor();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeContentEditor();
            }
        });
    }

    saveContent() {
        const content = this.richTextEditor.getContent();
        const preview = document.getElementById('content-preview');
        
        // Update preview
        preview.innerHTML = content || '<em>No content added yet</em>';
        
        // Close modal
        this.closeContentEditor();
    }

    closeContentEditor() {
        const modal = document.querySelector('.content-editor-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }

    async handleFormSubmission() {
        const formData = this.collectFormData();
        
        if (this.validateForm(formData)) {
            await this.savePost(formData);
        }
    }

    collectFormData() {
        return {
            title: document.getElementById('post-title').value.trim(),
            summary: document.getElementById('post-summary').value.trim(),
            content: this.richTextEditor ? this.richTextEditor.getContent() : document.getElementById('content-preview').innerHTML,
            date: document.getElementById('post-date').value,
            tags: document.getElementById('post-tags').value.trim(),
            externalLink: document.getElementById('post-external-link').value.trim(),
            status: document.getElementById('post-status').value,
            thumbnail: document.getElementById('post-thumbnail').files[0],
            images: Array.from(document.getElementById('post-images').files)
        };
    }

    validateForm(data) {
        const errors = [];

        if (!data.title) errors.push('Title is required');
        if (!data.summary) errors.push('Summary is required');
        if (!data.content || data.content === '<em>No content added yet</em>' || data.content.trim() === '') errors.push('Content is required');
        if (!data.date) errors.push('Publication date is required');

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    async savePost(data) {
        // Generate slug from title
        const slug = this.generateSlug(data.title);
        
        // Convert thumbnail to data URL if provided
        let thumbnailUrl = '../images/placeholder_image.png'; // Default placeholder
        if (data.thumbnail) {
            thumbnailUrl = await this.convertFileToDataURL(data.thumbnail);
        } else if (this.isEditing && this.currentPost) {
            // Keep existing thumbnail if no new one provided
            thumbnailUrl = this.currentPost.thumbnail;
        }
        
        // Create post object
        const post = {
            id: this.isEditing ? this.currentPost.id : Date.now(),
            title: data.title,
            summary: data.summary,
            content: data.content,
            date: data.date,
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
            externalLink: data.externalLink,
            status: 'published',
            slug: slug,
            thumbnail: thumbnailUrl,
            images: data.images.map(img => img.name),
            published: true,
            createdAt: new Date().toISOString()
        };

        // Save to Supabase database
        try {
            let response;
            
            if (this.isEditing) {
                console.log('Editing post with ID:', this.currentPost.id);
                // Update existing post
                    response = await fetch(`https://mustapha-suleiman222.vercel.app/api/update-post?id=${this.currentPost.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: post.title,
                        summary: post.summary,
                        content: post.content,
                        thumbnail: post.thumbnail,
                        externalLink: post.externalLink,
                        publishDate: post.date,
                        tags: post.tags,
                        status: post.status
                    })
                });
            } else {
                // Create new post
                    response = await fetch('https://mustapha-suleiman222.vercel.app/api/create-post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: post.title,
                        summary: post.summary,
                        content: post.content,
                        thumbnail: post.thumbnail,
                        externalLink: post.externalLink,
                        publishDate: post.date,
                        tags: post.tags,
                        status: post.status
                    })
                });
            }

            const result = await response.json();
            
            if (result.success) {
                alert(`Post "${data.title}" ${this.isEditing ? 'updated' : 'saved'} successfully!`);
                // Go back to dashboard
                this.showAdminDashboard();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error saving post. Please try again.');
        }
    }

    convertFileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // saveToLocalStorage method removed - now using Supabase database

    showPreview() {
        const data = this.collectFormData();
        
        if (!this.validateForm(data)) {
            return;
        }

        // Create preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview: ${data.title}</title>
                <link rel="stylesheet" href="../css/main.css">
            </head>
            <body>
                <div class="blog-post">
                    <h1>${data.title}</h1>
                    <div class="post-meta">
                        <span>Published: ${data.date}</span>
                        ${data.tags ? `<span>Tags: ${data.tags}</span>` : ''}
                    </div>
                    <div class="post-content">
                        ${data.content.replace(/\n/g, '<br>')}
                    </div>
                    ${data.externalLink ? `<a href="${data.externalLink}" target="_blank" class="btn btn-primary">Read Full Paper</a>` : ''}
                </div>
            </body>
            </html>
        `);
    }

    showManagePosts() {
        const posts = this.getAllPosts();
        
        const container = document.getElementById('admin-container');
        container.innerHTML = `
            <div class="admin-panel">
                <header class="admin-header">
                    <h1>Manage Posts</h1>
                    <div class="header-actions">
                        <button id="back-to-dashboard" class="btn btn-secondary">← Dashboard</button>
                        <button id="logout-btn" class="btn btn-secondary">Logout</button>
                    </div>
                </header>
                
                <main class="admin-content">
                    <div class="posts-management">
                        <div class="management-header">
                            <h2>All Posts (${posts.length})</h2>
                            <button id="create-new-post" class="btn btn-primary">Create New Post</button>
                        </div>
                        
                        <div class="posts-grid">
                            ${posts.length > 0 ? posts.map(post => this.createPostCard(post)).join('') : '<p class="no-posts">No posts found. Create your first post!</p>'}
                        </div>
                    </div>
                </main>
            </div>
        `;

        // Add event listeners
        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            window.adminAuth.showAdminPanel();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            window.adminAuth.logout();
        });

        document.getElementById('create-new-post').addEventListener('click', () => {
            this.showCreateForm();
        });

        // Add edit/delete event listeners for each post card
        posts.forEach(post => {
            const editBtn = document.getElementById(`edit-post-${post.id}`);
            const deleteBtn = document.getElementById(`delete-post-${post.id}`);
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.editPost(post.id);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deletePost(post.id);
                });
            }
        });
    }

    createPostCard(post) {
        const statusClass = 'status-published';
        const statusText = 'Published';
        const date = new Date(post.publishDate).toLocaleDateString();
        
        return `
            <div class="post-card">
                <div class="post-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}" onerror="this.src='../images/placeholder_image.png'">
                </div>
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-summary">${post.summary}</p>
                    <div class="post-meta">
                        <span class="post-date">${date}</span>
                        <span class="post-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="post-actions">
                        <button id="edit-post-${post.id}" class="btn btn-secondary btn-sm">Edit</button>
                        <button id="delete-post-${post.id}" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    async getAllPosts() {
        try {
            console.log('Admin: Fetching posts from API...');
            const response = await fetch('https://mustapha-suleiman222.vercel.app/api/get-posts');
            console.log('Admin: API response status:', response.status);
            const result = await response.json();
            console.log('Admin: API response data:', result);
            
            if (result.success) {
                console.log('Admin: Posts loaded successfully:', result.posts.length, 'posts');
                return result.posts;
            } else {
                console.error('Admin: Error fetching posts:', result.error);
                return [];
            }
        } catch (error) {
            console.error('Admin: Error fetching posts:', error);
            return [];
        }
    }

    async showAdminDashboard() {
        const posts = await this.getAllPosts();
        
        const container = document.getElementById('admin-container');
        container.innerHTML = `
            <div class="admin-panel">
                <header class="admin-header">
                    <h1>Admin Panel</h1>
                    <div class="header-actions">
                        <button id="create-post-btn" class="btn btn-primary">Create New Post</button>
                        <button id="logout-btn" class="btn btn-logout">🚪</button>
                    </div>
                </header>
                
                <main class="admin-content">
                    <div class="admin-dashboard">
                        <h2>All Blog Posts (${posts.length})</h2>
                        <div class="posts-grid">
                            ${posts.length > 0 ? posts.map(post => this.createAdminPostCard(post)).join('') : '<p class="no-posts">No posts found. Create your first post!</p>'}
                        </div>
                    </div>
                </main>
            </div>
        `;

        // Add event listeners
        document.getElementById('logout-btn').addEventListener('click', () => {
            window.adminAuth.logout();
        });

        document.getElementById('create-post-btn').addEventListener('click', () => {
            this.showCreateForm();
        });

        // Load thumbnails for all posts
        this.loadAllThumbnails(posts);

        // Add action event listeners for each post card
        posts.forEach(post => {
            const readBtn = document.getElementById(`read-post-${post.id}`);
            const editBtn = document.getElementById(`edit-post-${post.id}`);
            const deleteBtn = document.getElementById(`delete-post-${post.id}`);
            
            if (readBtn) {
                readBtn.addEventListener('click', () => {
                    this.readPost(post.id);
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.editPost(post.id);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deletePost(post.id);
                });
            }
        });
    }

    createAdminPostCard(post) {
        const statusClass = 'status-published';
        const statusText = 'Published';
        const date = new Date(post.publishDate).toLocaleDateString();
        
        return `
            <div class="admin-post-card">
                <div class="post-thumbnail">
                    <img src="../images/placeholder_image.png" alt="${post.title}" data-post-id="${post.id}">
                </div>
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-summary">${post.summary}</p>
                    <div class="post-meta">
                        <span class="post-date">${date}</span>
                        <span class="post-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="post-actions">
                        <button id="read-post-${post.id}" class="action-btn read-btn" title="Read Post">👁️</button>
                        <button id="edit-post-${post.id}" class="action-btn edit-btn" title="Edit Post">✏️</button>
                        <button id="delete-post-${post.id}" class="action-btn delete-btn" title="Delete Post">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    readPost(postId) {
        // Open the post in a new tab
        const post = this.getAllPosts().find(p => p.id == postId);
        if (post) {
            window.open(`../blog/posts/dynamic-post.html?slug=${post.slug}`, '_blank');
        }
    }

    async loadAllThumbnails(posts) {
        for (const post of posts) {
            const imgElement = document.querySelector(`img[data-post-id="${post.id}"]`);
            if (imgElement) {
                await this.loadThumbnail(post.id, imgElement);
            }
        }
    }

    async loadThumbnail(postId, imgElement) {
        try {
            const response = await fetch(`https://mustapha-suleiman222.vercel.app/api/get-thumbnail?id=${postId}`);
            const result = await response.json();
            
            if (result.success && result.thumbnail) {
                imgElement.src = result.thumbnail;
            }
        } catch (error) {
            console.error('Error loading thumbnail for post', postId, ':', error);
        }
    }

    async deletePost(postId) {
        const posts = await this.getAllPosts();
        const post = posts.find(p => p.id == postId);
        if (post) {
            if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                try {
                    const response = await fetch(`https://mustapha-suleiman222.vercel.app/api/delete-post?id=${postId}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('Post deleted successfully!');
                        // Refresh the dashboard
                        this.showAdminDashboard();
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error deleting post:', error);
                    alert('Error deleting post. Please try again.');
                }
            }
        }
    }

    showDashboard() {
        this.showAdminDashboard();
    }

    async editPost(postId) {
        // Find the post by ID
        const posts = await this.getAllPosts();
        const post = posts.find(p => p.id == postId);
        if (post) {
            // Fix the post object format for the form
            const formattedPost = {
                id: post.id, // Keep the original ID for updates
                title: post.title,
                summary: post.summary,
                content: post.content,
                publicationDate: post.publishDate?.split('T')[0] || '',
                tags: post.tags?.join(', ') || '',
                externalLink: post.externalLink || '',
                thumbnail: post.thumbnail || '',
                slug: post.slug
            };
            this.showCreateForm(formattedPost);
        } else {
            alert('Post not found!');
        }
    }
}

// Initialize blog post manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.adminAuth && window.adminAuth.isLoggedIn()) {
        window.blogPostManager = new BlogPostManager();
    }
});
