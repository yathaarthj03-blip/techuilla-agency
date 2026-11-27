import http.server
import os
import sys
import hashlib
import gzip
import mimetypes
import re
import json
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

PORT = int(os.environ.get('PORT', 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

YT_STATS_CACHE = {'ts': 0, 'data': None}
YT_VIDEO_IDS = ['CKjlKvKTz0s', 'Y09ReaDyEuw', 'JXiwxn6VpwM', 'gFy3TamJNkg', 'Tf3wVEpn8wU']

def fetch_single_yt_stat(vid):
    try:
        url = f"https://www.youtube.com/watch?v={vid}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept-Language': 'en-US,en;q=0.9'
        })
        html = urllib.request.urlopen(req, timeout=8).read().decode('utf-8', errors='ignore')
        views_m = re.findall(r'"viewCount":"(\d+)"', html)
        upload_m = re.findall(r'"uploadDate":"([^"]+)"', html) or re.findall(r'"publishDate":"([^"]+)"', html)
        likes_m = re.findall(r'"label":"([\d,]+)\s+likes"', html)
        if not likes_m:
            likes_m = re.findall(r'"likeCount":"?(\d+)"?', html)
        views = int(views_m[0]) if views_m else 0
        likes = int(likes_m[0].replace(',', '')) if likes_m else 0
        upload_iso = upload_m[0][:10] if upload_m else ''
        return vid, {'views': views, 'likes': likes, 'uploadDate': upload_iso}
    except Exception:
        return vid, None

def get_live_yt_stats():
    now = time.time()
    if YT_STATS_CACHE['data'] and (now - YT_STATS_CACHE['ts'] < 300):
        return YT_STATS_CACHE['data']
    results = {}
    with ThreadPoolExecutor(max_workers=5) as ex:
        for vid, stat in ex.map(fetch_single_yt_stat, YT_VIDEO_IDS):
            if stat and stat['views'] > 0:
                results[vid] = stat
    if results:
        YT_STATS_CACHE['ts'] = now
        YT_STATS_CACHE['data'] = results
    return results

# -----------------------------------------------------------------------------
# HIGH-SPEED STREAMING & CACHING SERVER (Dual-layer RAM + Disk Stream)
# - HTTP 206 Partial Content (Byte Range serving for video seek/loop)
# - In-memory compression & caching for static assets (< 2MB)
# - Chunked streaming for heavy media & 3D models (> 2MB)
# - Immutable 1-year Cache-Control headers for media/models/fonts
# -----------------------------------------------------------------------------

RAM_CACHE = {}
COMPRESSIBLE_EXTS = {'.html', '.css', '.js', '.json', '.svg', '.txt', '.md', '.xml'}
IMMUTABLE_ASSET_EXTS = {
    '.glb', '.gltf', '.fbx', '.obj', '.mtl', '.tga', '.bin',
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico',
    '.woff', '.woff2', '.ttf', '.otf',
    '.mp4', '.webm', '.ogg'
}

# Ensure correct MIME types
mimetypes.add_type('model/fbx', '.fbx')
mimetypes.add_type('model/obj', '.obj')
mimetypes.add_type('model/mtl', '.mtl')
mimetypes.add_type('image/x-tga', '.tga')
mimetypes.add_type('model/gltf-binary', '.glb')
mimetypes.add_type('model/gltf+json', '.gltf')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('video/mp4', '.mp4')

def get_file_metadata(file_path):
    try:
        stat = os.stat(file_path)
    except OSError:
        return None

    ext = os.path.splitext(file_path)[1].lower()
    content_type, _ = mimetypes.guess_type(file_path)
    if not content_type:
        if ext == '.fbx': content_type = 'model/fbx'
        elif ext == '.obj': content_type = 'model/obj'
        elif ext == '.glb': content_type = 'model/gltf-binary'
        elif ext == '.woff2': content_type = 'font/woff2'
        else: content_type = 'application/octet-stream'

    if ext in ('.html', '.css', '.js', '.json', '.svg', '.txt'):
        content_type += '; charset=utf-8'

    last_modified = http.server.SimpleHTTPRequestHandler.date_time_string(int(stat.st_mtime))
    etag = f'"{hashlib.md5(f"{stat.st_size}_{stat.st_mtime}".encode()).hexdigest()}"'

    return {
        'size': stat.st_size,
        'mtime': stat.st_mtime,
        'content_type': content_type,
        'last_modified': last_modified,
        'etag': etag,
        'ext': ext
    }


class DualStackServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        # Ignore client aborts / broken pipe when user navigates away
        pass


class TechuillaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        self.handle_request(send_body=False)

    def do_GET(self):
        self.handle_request(send_body=True)

    def handle_request(self, send_body=True):
        req_path = self.path.split('?')[0].split('#')[0]
        if req_path == '/api/youtube-stats':
            stats = get_live_yt_stats()
            payload = json.dumps({'ok': True, 'stats': stats}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            if send_body:
                self.wfile.write(payload)
            return
        if req_path in ('/sketchbook', '/sketchbook/'):
            req_path = '/sketchbook.html'
        elif req_path in ('/services', '/services/'):
            req_path = '/services.html'
        elif req_path in ('/contact', '/contact/'):
            req_path = '/contact.html'
        elif req_path == '/':
            req_path = '/index.html'

        rel_path = req_path.lstrip('/')
        full_path = os.path.join(DIRECTORY, rel_path)

        if not os.path.isfile(full_path):
            return super().do_GET()

        meta = get_file_metadata(full_path)
        if not meta:
            self.send_error(404, "File not found")
            return

        file_size = meta['size']
        etag = meta['etag']

        # ETag conditional validation (304 Not Modified)
        if_none_match = self.headers.get('If-None-Match')
        if if_none_match and if_none_match.strip() == etag:
            self.send_response(304)
            self.send_header('ETag', etag)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            return

        # Handle HTTP 206 Partial Content (Range requests)
        range_header = self.headers.get('Range')
        range_match = re.match(r'bytes=(\d+)-(\d*)', range_header) if range_header else None

        if range_match:
            start = int(range_match.group(1))
            end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
            if start >= file_size or end >= file_size or start > end:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{file_size}')
                self.end_headers()
                return

            chunk_len = end - start + 1
            self.send_response(206)
            self.send_header('Content-Type', meta['content_type'])
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(chunk_len))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('ETag', etag)
            self.send_header('Last-Modified', meta['last_modified'])
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, ETag')

            if meta['ext'] in IMMUTABLE_ASSET_EXTS:
                self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
            else:
                self.send_header('Cache-Control', 'public, max-age=86400')

            self.end_headers()

            if send_body:
                try:
                    with open(full_path, 'rb') as f:
                        f.seek(start)
                        remaining = chunk_len
                        buf_size = 64 * 1024
                        while remaining > 0:
                            chunk = f.read(min(remaining, buf_size))
                            if not chunk: break
                            self.wfile.write(chunk)
                            remaining -= len(chunk)
                except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
                    pass
            return

        # Full 200 OK Response
        # Check Gzip for small text/code assets (< 2MB)
        accept_encoding = self.headers.get('Accept-Encoding', '')
        can_gzip = meta['ext'] in COMPRESSIBLE_EXTS and file_size < 2 * 1024 * 1024 and 'gzip' in accept_encoding

        gzipped_data = None
        if can_gzip:
            cache_key = (full_path, meta['mtime'], 'gzip')
            if cache_key in RAM_CACHE:
                gzipped_data = RAM_CACHE[cache_key]
            else:
                with open(full_path, 'rb') as f:
                    raw = f.read()
                gzipped_data = gzip.compress(raw, compresslevel=6)
                RAM_CACHE[cache_key] = gzipped_data

        body_len = len(gzipped_data) if gzipped_data else file_size

        self.send_response(200)
        self.send_header('Content-Type', meta['content_type'])
        self.send_header('Content-Length', str(body_len))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('ETag', etag)
        self.send_header('Last-Modified', meta['last_modified'])
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, ETag')

        if gzipped_data:
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Vary', 'Accept-Encoding')

        if meta['ext'] in IMMUTABLE_ASSET_EXTS:
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        elif meta['ext'] in ('.js', '.css'):
            self.send_header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
        else:
            self.send_header('Cache-Control', 'public, max-age=0, must-revalidate')

        self.end_headers()

        if send_body:
            try:
                if gzipped_data:
                    self.wfile.write(gzipped_data)
                else:
                    with open(full_path, 'rb') as f:
                        buf_size = 64 * 1024
                        while True:
                            chunk = f.read(buf_size)
                            if not chunk: break
                            self.wfile.write(chunk)
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
                pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Origin, If-None-Match')
        self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, ETag')
        self.end_headers()


if __name__ == '__main__':
    print(f"Starting optimized streaming & caching server on port {PORT} from directory: {DIRECTORY}")
    with DualStackServer(('0.0.0.0', PORT), TechuillaHandler) as httpd:
        print(f"TECHUILLA AGENCY server running at http://localhost:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
