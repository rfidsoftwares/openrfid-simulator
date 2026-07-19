const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9999;
const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'assets', 'logo.svg');
const pngOutputPath = path.join(rootDir, 'assets', 'logo.png');

if (!fs.existsSync(svgPath)) {
  console.error(`Error: SVG logo not found at ${svgPath}`);
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>SVG to PNG Renderer</title>
  <style>
    body { background-color: #f0f0f0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
    canvas { background-color: transparent; border: 1px dashed #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    #status { margin-top: 20px; font-size: 18px; color: #333; }
  </style>
</head>
<body>
  <canvas id="canvas" width="1024" height="1024"></canvas>
  <div id="status">Rendering and exporting SVG to high-res PNG...</div>
  <script>
    const svgText = \`${svgContent.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    img.onload = function() {
      // Clear canvas and draw SVG
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      
      const pngDataUrl = canvas.toDataURL('image/png');
      
      // Post PNG back to server
      fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: pngDataUrl
      })
      .then(res => res.text())
      .then(txt => {
        document.getElementById('status').innerText = 'Success! Logo converted and saved. You can close this tab now.';
        console.log('Server response:', txt);
      })
      .catch(err => {
        document.getElementById('status').innerText = 'Error saving PNG: ' + err.message;
      });
    };
    
    img.onerror = function(err) {
      document.getElementById('status').innerText = 'Error loading SVG image: ' + JSON.stringify(err);
    };
    
    img.src = url;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Remove data URL prefix: "data:image/png;base64,"
        const base64Data = body.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(pngOutputPath, Buffer.from(base64Data, 'base64'));
        console.log(`[Success] High-res PNG logo successfully saved to: ${pngOutputPath}`);
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        
        // Stop server after successful save
        res.on('finish', () => {
          console.log('[Server] Shutting down...');
          process.exit(0);
        });
      } catch (err) {
        console.error('Error writing PNG file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error writing file: ' + err.message);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[Server] SVG to PNG server running on http://localhost:${PORT}`);
  console.log('[Server] Launching default browser to perform rendering...');
  
  // Open the URL in the default browser depending on OS
  const command = process.platform === 'win32' ? `start http://localhost:${PORT}` : `open http://localhost:${PORT}`;
  exec(command);
});
