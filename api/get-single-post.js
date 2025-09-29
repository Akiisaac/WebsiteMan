const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  try {
    const slug = req.query.slug;
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug is required'
      });
    }

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

    // Fetch single post by slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }
      throw error;
    }

    // Transform the post data
    const transformedPost = {
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      content: post.content,
      thumbnail: post.thumbnail,
      externalLink: post.external_link,
      publishDate: post.publish_date,
      tags: post.tags || [],
      status: post.status
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(200).json({
      success: true,
      post: transformedPost
    });

  } catch (error) {
    console.error('Error fetching single post:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
      message: error.message
    });
  }
};