import http.server
import socketserver
import webbrowser

class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map={
        ".js": "application/x-javascript",
        ".html": "text/html",
        ".css": "text/css",
        ".json": "application/json",
        "": "application/octet-stream",  
    }

PORT = 8000

httpd = socketserver.TCPServer(("", PORT), HTTPRequestHandler)
webbrowser.register('firefox',None,webbrowser.BackgroundBrowser("C:\\Program Files\\Mozilla Firefox\\firefox.exe"))
#input("zonks:")
webbrowser.get('firefox').open_new_tab("http://localhost:8000")
httpd.serve_forever()
