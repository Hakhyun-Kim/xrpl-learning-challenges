#!/usr/bin/env python3
"""
XRPL Learning Challenges Server
Simple HTTP server for testing the XRPL Learning Challenges application locally.
"""

import http.server
import socketserver
import os
import webbrowser
import json
from pathlib import Path

# Configuration
PORT = 8000
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

class XRPLChallengeServer(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with CORS support"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        # Handle OPTIONS requests for CORS preflight
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # Handle json files with proper content type
        if self.path.endswith('.json'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            try:
                file_path = os.path.join(PROJECT_DIR, self.path.lstrip('/'))
                with open(file_path, 'rb') as file:
                    self.wfile.write(file.read())
            except:
                self.wfile.write(b'{"error": "File not found"}')
            return
            
        return super().do_GET()

def verify_project_structure():
    """Verify that all necessary project directories exist, create if they don't"""
    directories = ['css', 'js', 'challenges', 'components']
    
    for directory in directories:
        dir_path = os.path.join(PROJECT_DIR, directory)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            print(f"Created directory: {directory}")

def start_server():
    """Start the HTTP server and open the browser"""
    os.chdir(PROJECT_DIR)  # Set working directory to project directory
    verify_project_structure()
    
    handler = XRPLChallengeServer
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        server_url = f"http://localhost:{PORT}"
        print(f"XRPL Learning Server running at: {server_url}")
        print(f"Project directory: {PROJECT_DIR}")
        print("Press Ctrl+C to stop the server.")
        
        # Open browser automatically
        webbrowser.open(server_url)
        
        # Keep server running
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped by user.")

if __name__ == "__main__":
    start_server()