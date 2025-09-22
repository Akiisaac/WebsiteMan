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
    await loadBlogData();
    displayBlogPosts();
    setupPagination();
}

/**
 * Load blog data from JSON file
 */
async function loadBlogData() {
    try {
        const response = await fetch('../data/blogs.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        blogData = data.posts.filter(post => post.published);
    } catch (error) {
        console.error('Error loading blog data:', error);
        // Fallback to hardcoded data if fetch fails
        blogData = [
            {
                id: "1",
                title: "Behavioral Responses of Cabbage Aphids to Volatile Cues",
                summary: "Investigating how cabbage aphids respond to volatile cues emitted by plants under herbivory by conspecifics and heterospecifics. This study reveals fascinating insights into chemical communication in pest communities.",
                thumbnail: "../images/placeholder_image.png",
                date: "2024-01-15",
                published: true,
                slug: "cabbage-aphids-volatile-cues"
            },
            {
                id: "2", 
                title: "Push-Pull Strategy for Oilseed Rape Pest Management",
                summary: "Developing innovative push-pull strategies targeting cabbage stem flea beetle and grey field slug in oilseed rape crops. Exploring natural and synthetic lures and deterrents for environmentally friendly crop protection.",
                thumbnail: "../images/placeholder_image.png",
                date: "2024-01-10",
                published: true,
                slug: "push-pull-oilseed-rape-management"
            },
            {
                id: "3",
                title: "Synthetic HIPVs in Natural Enemy Recruitment",
                summary: "Exploring the effectiveness of synthetic herbivore-induced plant volatiles (HIPVs) in recruiting natural enemies for biological control. Field studies show promising results for integrated pest management approaches.",
                thumbnail: "../images/placeholder_image.png", 
                date: "2024-01-05",
                published: true,
                slug: "synthetic-hipvs-natural-enemies"
            }
            ];
        }
}

/**
 * Display blog posts in the grid
 */
function displayBlogPosts() {
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
}

/**
 * Create a blog post card element
 */
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <img src="${post.thumbnail}" alt="${post.title}" class="blog-card-image">
        <div class="blog-card-content">
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-date">${formattedDate}</p>
            <p class="blog-card-summary">${post.summary}</p>
            <a href="posts/${post.slug}.html" class="blog-card-button">
                Read More
            </a>
        </div>
    `;

    return card;
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
