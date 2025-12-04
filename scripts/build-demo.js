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
            // Explicitly bundle all dependencies
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
  
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  
  <script>
    // Debug logging
    console.log('=== React/ReactDOM Loading Debug ===');
    console.log('React available:', typeof React !== 'undefined');
    console.log('ReactDOM available:', typeof ReactDOM !== 'undefined');
    
    if (typeof React !== 'undefined') {
      console.log('React version:', React.version);
    }
    
    if (typeof ReactDOM !== 'undefined') {
      console.log('ReactDOM keys:', Object.keys(ReactDOM).slice(0, 10));
      console.log('ReactDOM.createRoot available:', typeof ReactDOM.createRoot === 'function');
      console.log('ReactDOM.render available:', typeof ReactDOM.render === 'function');
    }
    
    // Ensure React and ReactDOM are available globally
    window.React = React;
    window.ReactDOM = ReactDOM;
    
    console.log('Window.React assigned:', typeof window.React !== 'undefined');
    console.log('Window.ReactDOM assigned:', typeof window.ReactDOM !== 'undefined');
    
    if (window.ReactDOM) {
      console.log('Window.ReactDOM.createRoot:', typeof window.ReactDOM.createRoot);
      console.log('Window.ReactDOM.render:', typeof window.ReactDOM.render);
    }
    
    console.log('=== End React/ReactDOM Loading Debug ===');
  </script>
  
  <!-- Load the bundled component -->
  <script src="./${folder}.bundle.js"></script>
  
  <script>
    // Debug logging for component rendering
    console.log('=== Component Rendering Debug ===');
    console.log('Window keys:', Object.keys(window).filter(key => ['React', 'ReactDOM', 'DemoComponent'].includes(key)));
    console.log('DemoComponent available:', typeof window.DemoComponent !== 'undefined');
    console.log('DemoComponent keys:', window.DemoComponent ? Object.keys(window.DemoComponent) : 'N/A');
    
    // Render the component
    try {
      console.log('Starting component rendering process...');
      
      // Get the component from the global namespace
      const Component = window.DemoComponent?.default || window.DemoComponent;
      console.log('Component resolved:', typeof Component, Component ? 'Component found' : 'Component not found');
      
      if (Component) {
        // Create root element and render
        const rootElement = document.getElementById('root');
        console.log('Root element found:', !!rootElement);
        
        // Check if ReactDOM is available
        console.log('Checking ReactDOM availability...');
        console.log('window.ReactDOM:', typeof window.ReactDOM);
        
        if (!window.ReactDOM) {
          throw new Error('ReactDOM is not available');
        }
        
        console.log('ReactDOM.createRoot type:', typeof window.ReactDOM.createRoot);
        console.log('ReactDOM.render type:', typeof window.ReactDOM.render);
        
        // Use createRoot for React 18+ or fallback to render for older versions
        if (typeof window.ReactDOM.createRoot === 'function') {
          console.log('Using ReactDOM.createRoot for rendering...');
          const root = window.ReactDOM.createRoot(rootElement);
          root.render(window.React.createElement(Component));
        } else if (typeof window.ReactDOM.render === 'function') {
          console.log('Using ReactDOM.render for rendering...');
          window.ReactDOM.render(window.React.createElement(Component), rootElement);
        } else {
          console.error('Neither ReactDOM.createRoot nor ReactDOM.render is available');
          console.log('Available ReactDOM methods:', Object.keys(window.ReactDOM || {}));
          throw new Error('Neither ReactDOM.createRoot nor ReactDOM.render is available');
        }
        
        console.log('Component rendered successfully');
      } else {
        console.error('Component not found');
        document.getElementById('root').innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component not found.</p></div>';
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      console.error('Error stack:', error.stack);
      document.getElementById('root').innerHTML = '<div class="p-4 text-center text-red-500"><h2 class="text-xl font-bold mb-2">Error</h2><p>Failed to render component: ' + error.message + '</p><p class="text-xs mt-2">Check console for details</p></div>';
    }
    
    console.log('=== End Component Rendering Debug ===');
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