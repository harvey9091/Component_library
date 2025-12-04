const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

// Function to build demos for all components
async function buildDemos() {
  const componentsDir = path.join(__dirname, '..', 'components');
  const demosOutputDir = path.join(__dirname, '..', 'site', 'public', 'demos');
  
  // Create demos directory if it doesn't exist
  if (!fs.existsSync(demosOutputDir)) {
    fs.mkdirSync(demosOutputDir, { recursive: true });
  }
  
  // Check if components directory exists
  if (!fs.existsSync(componentsDir)) {
    console.log('No components directory found');
    console.log('Demo build completed! Built 0 demos.');
    return;
  }
  
  const componentFolders = fs.readdirSync(componentsDir);
  let builtCount = 0;
  
  for (const folder of componentFolders) {
    const componentPath = path.join(componentsDir, folder);
    const stat = fs.statSync(componentPath);
    
    if (stat.isDirectory()) {
      const indexPath = path.join(componentPath, 'index.tsx');
      const demoPath = path.join(componentPath, 'demo.tsx');
      
      // Only process folders that contain index.tsx or demo.tsx
      if (fs.existsSync(indexPath) || fs.existsSync(demoPath)) {
        // Use demo.tsx if it exists, otherwise fallback to index.tsx
        const entryPoint = fs.existsSync(demoPath) ? demoPath : indexPath;
        
        try {
          console.log(`Demo: building ${folder}`);
          
          // Delete any existing bundle file to avoid caching issues
          const bundlePath = path.join(demosOutputDir, `${folder}.bundle.js`);
          if (fs.existsSync(bundlePath)) {
            fs.unlinkSync(bundlePath);
          }
          
          // Bundle the component using esbuild with specific handling for dependencies
          // We'll bundle everything together to avoid dynamic require issues
          const result = await build({
            entryPoints: [entryPoint],
            bundle: true,
            format: 'iife',
            globalName: 'DemoComponent',
            outfile: bundlePath,
            jsx: 'transform',
            loader: {
              '.tsx': 'tsx',
              '.ts': 'ts',
              '.jsx': 'jsx',
              '.js': 'js'
            },
            sourcemap: false,
            minify: false,
            define: {
              'process.env.NODE_ENV': '"production"'
            },
            // Bundle all dependencies including React and ReactDOM
            // This avoids dynamic require issues
            packages: 'bundle'
          });
          
          // Create the HTML file with the bundled component
          const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${folder} Demo</title>
  <style>
    /*! Minimal CSS reset and Tailwind utilities */
    *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{margin:0;padding:0}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}body{min-height:100vh}.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.gap-4{gap:1rem}.p-4{padding:1rem}.text-center{text-align:center}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99/var(--tw-text-opacity))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.min-h-screen{min-height:100vh}.w-full{width:100%}.rounded-lg{border-radius:.5rem}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0/.1),0 2px 4px -2px rgb(0 0 0/.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.p-6{padding:1.5rem}.mb-2{margin-bottom:.5rem}
    
    /* Error overlay styles */
    .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ff0000;
      color: white;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: monospace;
      overflow: auto;
    }
    
    .error-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .error-message {
      font-size: 1rem;
      max-width: 80%;
      text-align: center;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="p-4 text-center">
      <h2 class="text-xl font-bold mb-2">${folder} Demo</h2>
      <p class="text-gray-600">Loading component...</p>
    </div>
  </div>
  
  <script>
    // Simple error handling
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error:', message, 'at', source, ':', lineno, ':', colno);
      showError('Global Error: ' + message);
      return true;
    };
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection:', event.reason);
      showError('Promise Rejection: ' + event.reason);
      event.preventDefault();
    });
    
    // Show error overlay
    function showError(message) {
      // Remove existing error overlay if present
      const existingOverlay = document.querySelector('.error-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Create error overlay
      const overlay = document.createElement('div');
      overlay.className = 'error-overlay';
      overlay.innerHTML = \`
        <div class="error-title">DEMO RENDERING ERROR</div>
        <div class="error-message">\${message}</div>
        <div class="error-message" style="margin-top: 1rem; font-size: 0.8rem;">Check browser console for detailed stack trace</div>
      \`;
      document.body.appendChild(overlay);
    }
    
    // Try to connect to live-reload websocket (optional)
    try {
      const ws = new WebSocket('ws://localhost:8081');
      ws.onopen = function() {
        console.log('Demo: Live-reload WebSocket connected');
      };
      ws.onerror = function() {
        console.log('Demo: Live-reload WebSocket connection failed (continuing without live-reload)');
      };
    } catch (e) {
      console.log('Demo: Live-reload WebSocket unavailable (continuing without live-reload)');
    }
  </script>
  
  <!-- Load the bundled component (includes all dependencies: React, ReactDOM, lucide-react) -->
  <script>
    console.log('Demo: loading bundle: ./${folder}.bundle.js');
  </script>
  <script src="./${folder}.bundle.js?v=${Date.now()}"></script>
  <script>
    console.log('Demo: bundle loaded');
  </script>
  
  <script>
    // Render the component
    document.addEventListener('DOMContentLoaded', function() {
      try {
        console.log('Demo: Starting component rendering process...');
        
        // Check if React is available globally (it should be bundled)
        console.log('Demo: React present:', typeof React !== 'undefined', React?.version ? 'version: ' + React.version : '');
        console.log('Demo: ReactDOM present:', typeof ReactDOM !== 'undefined', ReactDOM?.version ? 'version: ' + ReactDOM.version : '');
        
        // Check if we have the component
        console.log('Demo: Bundle exports:', Object.keys(typeof DemoComponent !== 'undefined' ? DemoComponent : {}));
        
        if (typeof DemoComponent === 'undefined') {
          console.error('Demo: DemoComponent is not defined');
          showError('DemoComponent is not defined. Check browser console for details.');
          return;
        }
        
        // Get the component
        const Component = DemoComponent.default || DemoComponent;
        
        if (!Component) {
          console.error('Demo: Component not found in DemoComponent');
          showError('Component not found in DemoComponent. Check browser console for details.');
          return;
        }
        
        console.log('Demo: Found DemoComponent:', typeof Component);
        
        // Render the component
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.error('Demo: Root element not found');
          showError('Root element not found. Check browser console for details.');
          return;
        }
        
        // Clear the root element
        rootElement.innerHTML = '';
        
        // Try to render with React
        try {
          // Check if React is available in the bundle
          const bundledReact = DemoComponent.React || window.React;
          const bundledReactDOM = DemoComponent.ReactDOM || window.ReactDOM;
          
          console.log('Demo: Bundled React available:', !!bundledReact, bundledReact?.version ? 'version: ' + bundledReact.version : '');
          console.log('Demo: Bundled ReactDOM available:', !!bundledReactDOM, bundledReactDOM?.version ? 'version: ' + bundledReactDOM.version : '');
          
          if (bundledReact && bundledReactDOM) {
            if (bundledReactDOM.createRoot) {
              console.log('Demo: Using createRoot with bundled React');
              const root = bundledReactDOM.createRoot(rootElement);
              const element = bundledReact.createElement(Component);
              root.render(element);
              console.log('Demo: Mount succeeded');
            } else if (bundledReactDOM.render) {
              console.log('Demo: Using legacy render with bundled React');
              const element = bundledReact.createElement(Component);
              bundledReactDOM.render(element, rootElement);
              console.log('Demo: Mount succeeded');
            } else {
              throw new Error('No rendering method found in bundled ReactDOM');
            }
          } else if (typeof ReactDOM !== 'undefined' && typeof React !== 'undefined') {
            // Fallback to global React if bundled React is not available
            console.log('Demo: Using global React as fallback');
            if (ReactDOM.createRoot) {
              console.log('Demo: Using createRoot with global React');
              const root = ReactDOM.createRoot(rootElement);
              const element = React.createElement(Component);
              root.render(element);
              console.log('Demo: Mount succeeded');
            } else if (ReactDOM.render) {
              console.log('Demo: Using legacy render with global React');
              const element = React.createElement(Component);
              ReactDOM.render(element, rootElement);
              console.log('Demo: Mount succeeded');
            } else {
              throw new Error('No rendering method found in global ReactDOM');
            }
          } else {
            throw new Error('Neither bundled nor global React/ReactDOM available');
          }
        } catch (renderError) {
          console.error('Demo: Mount failed:', renderError);
          console.error('Demo: Render error stack:', renderError.stack);
          showError('Mount failed: ' + renderError.message);
          throw renderError;
        }
      } catch (error) {
        console.error('Demo: Error in main rendering process:', error);
        console.error('Demo: Error stack:', error.stack);
        showError('Rendering process failed: ' + error.message);
      }
    });
  </script>
</body>
</html>`;
          
          // Write the HTML file
          const outputPath = path.join(demosOutputDir, `${folder}.html`);
          fs.writeFileSync(outputPath, htmlContent);
          
          console.log(`Built demo for ${folder}`);
          builtCount++;
        } catch (err) {
          console.error(`Error building demo for ${folder}:`, err.message);
          console.error(err.stack);
        }
      }
    }
  }
  
  console.log(`Demo build completed! Built ${builtCount} demos.`);
}

// Run the function
buildDemos().catch(err => {
  console.error('Demo build failed:', err);
  process.exit(1);
});