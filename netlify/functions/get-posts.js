const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Path to posts data file
    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
    
    // Check if file exists, if not create empty array
    let posts = [];
    try {
      const fileContent = await fs.readFile(postsFilePath, 'utf8');
      posts = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with empty array
        await fs.mkdir(path.dirname(postsFilePath), { recursive: true });
        await fs.writeFile(postsFilePath, JSON.stringify([], null, 2));
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
