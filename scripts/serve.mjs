import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.env.SITE_ROOT || 'public');
const port = Number(process.env.PORT || 4510);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.woff2':'font/woff2', '.json':'application/json', '.mp4':'video/mp4' };
http.createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end('Method not allowed'); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const file = await stat(target);
    if (!file.isFile()) throw new Error('Not a file');
    const headers = {'Content-Type':types[path.extname(target)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Accept-Ranges':'bytes'};
    let start = 0, end = file.size - 1, status = 200;
    if (req.headers.range && req.method === 'GET') {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, file.size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
      }
      if (!range || (!range[1] && !range[2]) || start > end || start >= file.size) {
        res.writeHead(416, {...headers, 'Content-Range':`bytes */${file.size}`}); res.end(); return;
      }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || file.size === 0) { res.end(); return; }
    const stream = createReadStream(target, {start,end});
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Megha preview: http://localhost:${port}`));
