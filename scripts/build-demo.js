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
          // Bundle the component using esbuild with specific handling for dependencies
          const result = await build({
            entryPoints: [entryPoint],
            bundle: true,
            format: 'iife',
            globalName: 'DemoComponent',
            outfile: path.join(demosOutputDir, `${folder}.bundle.js`),
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
      document.getElementById('root').innerHTML = '<div class="p-4 text-center text-red-500"><h2 class="text-xl font-bold mb-2">Error</h2><p>' + message + '</p><p class="text-xs mt-2">Check console for details</p></div>';
    };
  </script>
  
  <!-- Load the bundled component (includes all dependencies: React, ReactDOM, lucide-react) -->
  <script src="./${folder}.bundle.js"></script>
  
  <script>
    // Render the component
    document.addEventListener('DOMContentLoaded', function() {
      try {
        // Check if we have the component
        if (typeof DemoComponent === 'undefined') {
          console.error('DemoComponent is not defined');
          document.getElementById('root').innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component not loaded.</p></div>';
          return;
        }
        
        // Get the component
        const Component = DemoComponent.default || DemoComponent;
        
        if (!Component) {
          console.error('Component not found in DemoComponent');
          document.getElementById('root').innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component not found.</p></div>';
          return;
        }
        
        // Render the component
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.error('Root element not found');
          return;
        }
        
        // Use the bundled React and ReactDOM
        if (typeof ReactDOM !== 'undefined' && typeof ReactDOM.createRoot === 'function') {
          // React 18+ rendering
          const root = ReactDOM.createRoot(rootElement);
          root.render(React.createElement(Component));
        } else if (typeof ReactDOM !== 'undefined' && typeof ReactDOM.render === 'function') {
          // Older React rendering
          ReactDOM.render(React.createElement(Component), rootElement);
        } else {
          // Fallback - show static content
          rootElement.innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component loaded successfully!</p></div>';
        }
      } catch (error) {
        console.error('Error rendering component:', error);
        document.getElementById('root').innerHTML = '<div class="p-4 text-center text-red-500"><h2 class="text-xl font-bold mb-2">Error</h2><p>Failed to render component: ' + error.message + '</p></div>';
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