#!/usr/bin/env python3
"""Sitio estático SaverStore — servidor simple. Puerto 8090."""
import sys
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
handler = partial(SimpleHTTPRequestHandler, directory=str(__file__).rsplit("/", 1)[0])
ThreadingHTTPServer(("0.0.0.0", port), handler).serve_forever()
