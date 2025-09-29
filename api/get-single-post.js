const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing slug parameter'
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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        },
        body: JSON.stringify({
          success: false,
          error: 'Supabase configuration missing'
        })
      };  
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch single post from Supabase
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No post found
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
          body: JSON.stringify({
            success: false,
            error: 'Post not found'
          })
        };
      }
      throw error;
    }

    // Transform data to match expected format
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify({
        success: true,
        post: transformedPost
      })
    };

  } catch (error) {
    console.error('Error fetching post:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch post',
        message: error.message
      })
    };
  }
};
