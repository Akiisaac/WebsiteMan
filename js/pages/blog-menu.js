/**
 * Blog Menu - Handles blog post loading and display
 */

let blogData = [];
let currentPage = 1;
const postsPerPage = 9;

/**
 * Initialize blog menu functionality
 */
async function initializeBlogMenu() {
    console.log('Initializing blog menu...');
    showLoadingState();
    
    // Add a small delay to ensure loading state is visible
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = await loadBlogData();
    console.log('Blog data loaded:', success);
    if (success) {
        displayBlogPosts();
    } else {
        showErrorState();
    }
    setupPagination();
}

/**
 * Load blog data from Supabase database
 */
async function loadBlogData() {
    try {
        console.log('Fetching blog data from API...');
        const response = await fetch('https://mustapha-suleiman222.vercel.app/api/get-posts');
        console.log('API response status:', response.status);
        const result = await response.json();
        console.log('API response data:', result);
        
        if (result.success) {
            // Sort by date (newest first)
            blogData = result.posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            console.log('Blog data loaded successfully:', blogData.length, 'posts');
            return true;
        } else {
            console.error('Error loading blog data:', result.error);
            blogData = [];
            return false;
        }
        
    } catch (error) {
        console.error('Error loading blog data:', error);
        blogData = [];
        return false;
    }
}

/**
 * Show loading state with spinner
 */
function showLoadingState() {
    console.log('Showing loading state...');
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) {
        console.error('Blog grid element not found!');
        return;
    }
    
    blogGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <h3>Loading blog posts...</h3>
            <p>Fetching your latest research updates from our database.</p>
        </div>
    `;
    console.log('Loading state displayed');
}

/**
 * Show error state with retry button
 */
function showErrorState() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    blogGrid.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Unable to load blog posts</h3>
            <p>There was a problem connecting to our database. This might be a temporary issue.</p>
            <button class="btn btn-primary retry-btn" onclick="retryLoadBlogData()">Try Again</button>
        </div>
    `;
}

/**
 * Retry loading blog data
 */
async function retryLoadBlogData() {
    showLoadingState();
    const success = await loadBlogData();
    if (success) {
        displayBlogPosts();
    } else {
        showErrorState();
    }
}

/**
 * Display blog posts in the grid
 */
function displayBlogPosts() {
    console.log('Displaying blog posts...');
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) {
        console.error('Blog grid element not found!');
        return;
    }

    // Clear existing content
    blogGrid.innerHTML = '';

    // Calculate posts to show for current page
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = blogData.slice(startIndex, endIndex);

    console.log('Posts to show:', postsToShow.length, 'out of', blogData.length, 'total posts');

    if (postsToShow.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-posts">
                <h3>No blog posts available</h3>
                <p>Check back later for new research updates.</p>
            </div>
        `;
        return;
    }

    // Create blog post cards
    postsToShow.forEach(post => {
        const blogCard = createBlogCard(post);
        blogGrid.appendChild(blogCard);
    });

    // Update pagination
    updatePagination();
    console.log('Blog posts displayed successfully');
}

/**
 * Create a blog post card element
 */
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    
    const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <img src="../images/placeholder_image.png" alt="${post.title}" class="blog-card-image" data-post-id="${post.id}">
        <div class="blog-card-content">
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-date">${formattedDate}</p>
            <p class="blog-card-summary">${post.summary}</p>
            <a href="posts/dynamic-post.html?slug=${post.slug}" class="blog-card-button">
                Read More
            </a>
        </div>
    `;

    // Load thumbnail separately
    loadThumbnail(post.id, card.querySelector('.blog-card-image'));

    return card;
}

/**
 * Load thumbnail for a specific post
 */
async function loadThumbnail(postId, imgElement) {
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

/**
 * Show coming soon message for blog posts
 */
function showComingSoon(title) {
    alert(`"${title}" - Coming Soon!\n\nIndividual blog post pages are under development. Check back later for the full research documentation.`);
}

/**
 * Setup pagination controls
 */
function setupPagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayBlogPosts();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(blogData.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayBlogPosts();
            }
        });
    }
}

/**
 * Update pagination display
 */
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    if (!pagination || !pageInfo) return;

    const totalPages = Math.ceil(blogData.length / postsPerPage);

    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

// Export for global use
window.BlogMenu = {
    initialize: initializeBlogMenu,
    showComingSoon: showComingSoon
};
