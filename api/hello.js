module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  return res.status(200).json({
    message: 'Hello from Vercel Functions!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};