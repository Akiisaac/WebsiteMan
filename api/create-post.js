const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Parse request body
    const newPost = req.body;
    
    // Validate required fields
    if (!newPost.title || !newPost.summary || !newPost.content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, summary, content'
      });
    }

    // Generate unique ID and slug
    const id = Date.now().toString();
    const slug = newPost.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Create post object
    const post = {
      id: id,
      slug: slug,
      title: newPost.title,
      summary: newPost.summary,
      content: newPost.content,
      thumbnail: newPost.thumbnail || '',
      externalLink: newPost.externalLink || '',
      publishDate: newPost.publishDate || new Date().toISOString(),
      tags: newPost.tags || [],
      status: 'published'
    };

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

    // Insert post into Supabase
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        slug: slug,
        title: newPost.title,
        summary: newPost.summary,
        content: newPost.content,
        thumbnail: newPost.thumbnail || '',
        external_link: newPost.externalLink || '',
        publish_date: newPost.publishDate || new Date().toISOString(),
        tags: newPost.tags || [],
        status: 'published'
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform response data
    const createdPost = {
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
    
    return res.status(201).json({
      success: true,
      post: createdPost,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Error creating post:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create post',
      message: error.message
    });
  }
};
