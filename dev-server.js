import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/wheel.js', ['wheel.js', 'text/javascript']],
]);

createServer(async (request, response) => {
  const asset = assets.get(new URL(request.url, 'http://localhost').pathname);
  if (!asset) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const body = await readFile(new URL(asset[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': `${asset[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(500).end('Unable to load file');
  }
}).listen(8080, '127.0.0.1', () => {
  console.log('Productivity Roulette: http://127.0.0.1:8080');
});
