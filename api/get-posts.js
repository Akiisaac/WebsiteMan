const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase configuration missing'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch posts from Supabase with timeout
    const fetchPromise = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('publish_date', { ascending: false });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 10000)
    );
    
    const { data: posts, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) {
      throw error;
    }

    // Transform data to match expected format
    const transformedPosts = posts.map(post => ({
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      content: post.content,
      thumbnail: post.thumbnail ? 'data:image/png;base64,placeholder' : '../images/placeholder_image.png', // Use placeholder to reduce size
      externalLink: post.external_link,
      publishDate: post.publish_date,
      tags: post.tags || [],
      status: post.status
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    return res.status(200).json({
      success: true,
      posts: transformedPosts,
      count: transformedPosts.length
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
};
