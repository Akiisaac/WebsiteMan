const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow PUT requests
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    const postId = event.queryStringParameters?.id;
    if (!postId) {
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
          error: 'Missing post ID in query parameters'
        })
      };
    }

    // Parse request body
    const updatedPost = JSON.parse(event.body);
    
    // Validate required fields
    if (!updatedPost.title || !updatedPost.summary || !updatedPost.content) {
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
          error: 'Missing required fields: title, summary, content'
        })
      };
    }

    // Generate new slug if title changed
    const slug = updatedPost.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
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
        status: updatedPost.status || 'published',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform response data
    const resultPost = {
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
        post: resultPost,
        message: 'Post updated successfully'
      })
    };

  } catch (error) {
    console.error('Error updating post:', error);
    
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
        error: 'Failed to update post',
        message: error.message
      })
    };
  }
};