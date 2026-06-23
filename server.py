#!/usr/bin/env python3
"""Sitio estático SaverStore — servidor simple. Puerto 8090."""
import sys
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = str(__file__).rsplit("/", 1)[0]


class Handler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            self.send_response(code)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            with open(f"{ROOT}/404.html", "rb") as f:
                body = f.read()
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().send_error(code, message, explain)


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
handler = partial(Handler, directory=ROOT)
ThreadingHTTPServer(("0.0.0.0", port), handler).serve_forever()
