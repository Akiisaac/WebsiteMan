const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const postId = req.query.id;
    const updatedPost = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      });
    }

    // Validate required fields
    if (!updatedPost.title || !updatedPost.summary || !updatedPost.content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, summary, content'
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase configuration missing'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate slug from title
    const slug = updatedPost.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Update post in Supabase
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        slug: slug,
        title: updatedPost.title,
        summary: updatedPost.summary,
        content: updatedPost.content,
        thumbnail: updatedPost.thumbnail || '',
        external_link: updatedPost.externalLink || '',
        publish_date: updatedPost.publishDate || new Date().toISOString(),
        tags: updatedPost.tags || [],
        status: 'published'
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform response data
    const transformedPost = {
      id: data.id.toString(),
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      content: data.content,
      thumbnail: data.thumbnail,
      externalLink: data.external_link,
      publishDate: data.publish_date,
      tags: data.tags || [],
      status: data.status
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    return res.status(200).json({
      success: true,
      post: transformedPost,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Error updating post:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update post',
      message: error.message
    });
  }
};