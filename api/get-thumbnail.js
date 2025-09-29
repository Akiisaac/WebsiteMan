const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  try {
    // Get post ID from query parameters
    const postId = req.query.id;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
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

    // Fetch thumbnail for specific post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('thumbnail')
      .eq('id', postId)
      .single();

    if (error) {
      throw error;
    }

    if (!post || !post.thumbnail) {
      return res.status(404).json({
        success: false,
        error: 'Thumbnail not found'
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(200).json({
      success: true,
      thumbnail: post.thumbnail
    });

  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch thumbnail',
      message: error.message
    });
  }
};
