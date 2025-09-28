const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Path to posts data file (relative to function directory)
    const postsFilePath = path.join(__dirname, '..', '..', 'data', 'posts.json');
    
    // Read posts from file
    let posts = [];
    try {
      const fileContent = await fs.readFile(postsFilePath, 'utf8');
      posts = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        posts = [];
      } else {
        throw error;
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

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
        posts: posts,
        count: posts.length
      })
    };

  } catch (error) {
    console.error('Error fetching posts:', error);
    
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
        error: 'Failed to fetch posts',
        message: error.message
      })
    };
  }
};
