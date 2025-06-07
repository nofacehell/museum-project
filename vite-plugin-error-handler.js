/**
 * Custom Vite plugin to handle direct file access attempts and other errors
 */
export default function errorHandler() {
  return {
    name: 'error-handler',
    configureServer(server) {
      // Add custom middleware to handle errors
      return () => {
        server.middlewares.use((req, res, next) => {
          // Check if trying to access source files directly
          if (req.url.match(/\/src\/.*\.jsx$/)) {
            console.log(`[ErrorHandler] Blocked direct access attempt to: ${req.url}`);
            
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Resource Not Found</title>
                  <style>
                    body {
                      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                      margin: 0;
                      background-color: #f8fafc;
                      color: #1e293b;
                    }
                    .container {
                      max-width: 600px;
                      padding: 2rem;
                      text-align: center;
                    }
                    h1 { color: #334155; margin-bottom: 1rem; }
                    p { line-height: 1.6; }
                    .redirect { margin-top: 2rem; }
                    .redirect a {
                      color: #3b82f6;
                      text-decoration: none;
                      font-weight: 500;
                    }
                    .redirect a:hover { text-decoration: underline; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Resource Not Found</h1>
                    <p>The file you're looking for is not directly accessible. This is a single-page application and all navigation should be done through the main interface.</p>
                    <div class="redirect">
                      <a href="/">Return to Homepage</a>
                    </div>
                  </div>
                  <script>
                    // Automatically redirect after 3 seconds
                    setTimeout(() => { window.location.href = '/'; }, 3000);
                  </script>
                </body>
              </html>
            `);
            return;
          }
          next();
        });
      };
    }
  };
} 