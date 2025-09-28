const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
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
    // Parse request body
    const newPost = JSON.parse(event.body);
    
    // Validate required fields
    if (!newPost.title || !newPost.summary || !newPost.content) {
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

    // Read existing posts
    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
    let posts = [];
    
    try {
      const fileContent = await fs.readFile(postsFilePath, 'utf8');
      posts = JSON.parse(fileContent);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Add new post
    posts.unshift(post); // Add to beginning of array

    // Write updated posts back to file
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify({
        success: true,
        post: post,
        message: 'Post created successfully'
      })
    };

  } catch (error) {
    console.error('Error creating post:', error);
    
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
        error: 'Failed to create post',
        message: error.message
      })
    };
  }
};
