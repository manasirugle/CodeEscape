const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const ROOT = 'C:/CodeEscape';

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  const url = req.url.split('?')[0] || '/';
  const filePath = path.join(ROOT, url === '/' ? 'hub.html' : url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log('CodeEscape server running at http://localhost:' + PORT);
  console.log('Level 1: http://localhost:' + PORT + '/level1.html');
  console.log('Level 2: http://localhost:' + PORT + '/level2.html');
  console.log('Level 3: http://localhost:' + PORT + '/level3.html');
});
