const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    // Get post ID from query parameters
    const postId = event.queryStringParameters?.id;
    
    if (!postId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Post ID is required'
        })
      };
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Supabase configuration missing'
        })
      };
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
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Thumbnail not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({
        success: true,
        thumbnail: post.thumbnail
      })
    };

  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch thumbnail',
        message: error.message
      })
    };
  }
};
