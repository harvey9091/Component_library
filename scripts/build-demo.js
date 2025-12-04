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
          // Bundle the component using esbuild
          const result = await build({
            entryPoints: [entryPoint],
            bundle: true,
            format: 'iife',
            globalName: 'DemoComponent',
            outfile: path.join(demosOutputDir, `${folder}.bundle.js`),
            external: ['react', 'react-dom', 'lucide-react'],
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
            }
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
  
  <!-- Load React and dependencies -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
  
  <script>
    // Debug logging
    console.log('=== Dependency Loading Debug Info ===');
    console.log('Window object keys:', Object.keys(window).filter(key => ['React', 'ReactDOM', 'lucide', 'LucideIcons'].includes(key) || key.toLowerCase().includes('react')));
    
    // Make dependencies available globally with extensive debugging
    window.React = window.React || React;
    window.ReactDOM = window.ReactDOM || ReactDOM;
    
    // Handle lucide-react - try multiple possible global names with debugging
    console.log('Checking for lucide-react exports...');
    console.log('window.lucide:', typeof window.lucide, window.lucide ? Object.keys(window.lucide).slice(0, 5) : 'undefined');
    console.log('lucide:', typeof lucide, lucide ? Object.keys(lucide).slice(0, 5) : 'undefined');
    
    window.LucideIcons = window.lucide || window.LucideIcons || lucide || {};
    console.log('LucideIcons set to:', typeof window.LucideIcons, window.LucideIcons ? Object.keys(window.LucideIcons).slice(0, 5) : 'undefined');
    
    // Create a robust require polyfill that handles all possible cases with debugging
    function require(moduleName) {
      console.log('Require called with:', moduleName);
      switch (moduleName) {
        case 'react':
          console.log('Returning React:', typeof window.React);
          return window.React;
        case 'react-dom':
          console.log('Returning ReactDOM:', typeof window.ReactDOM);
          return window.ReactDOM;
        case 'lucide-react':
          console.log('Returning LucideIcons:', typeof window.LucideIcons);
          return window.LucideIcons;
        default:
          console.warn('Module not found: ' + moduleName);
          return {};
      }
    }
    
    // Attach to window for global access
    window.require = require;
    
    // Provide module.exports for CommonJS compatibility
    window.module = window.module || { exports: {} };
    window.exports = window.exports || window.module.exports;
    
    console.log('=== End Dependency Loading Debug Info ===');
  </script>
  
  <!-- Load the bundled component -->
  <script src="./${folder}.bundle.js"></script>
  
  <script>
    // Render the component with extensive error handling and debugging
    console.log('=== Component Detection Debug Info ===');
    console.log('Window object keys:', Object.keys(window).filter(key => ['DemoComponent', 'module', 'exports'].includes(key)));
    console.log('DemoComponent:', typeof window.DemoComponent, window.DemoComponent);
    console.log('module:', typeof window.module, window.module);
    console.log('module.exports:', typeof window.module?.exports, window.module?.exports);
    
    try {
      // Try multiple ways to access the component
      let Component = null;
      
      // Method 1: Global namespace
      if (window.DemoComponent) {
        console.log('Found DemoComponent in global namespace');
        Component = window.DemoComponent.default || window.DemoComponent;
        console.log('Component from DemoComponent:', typeof Component, Component);
      }
      
      // Method 2: Module exports
      if (!Component && window.module && window.module.exports) {
        console.log('Found component in module.exports');
        Component = window.module.exports.default || window.module.exports;
        console.log('Component from module.exports:', typeof Component, Component);
      }
      
      // Method 3: Direct global
      if (!Component) {
        console.log('Trying direct global access');
        Component = DemoComponent;
        console.log('Component from direct access:', typeof Component, Component);
      }
      
      // Method 4: Check if DemoComponent itself is the component
      if (!Component && typeof window.DemoComponent === 'function') {
        console.log('Using DemoComponent directly as function');
        Component = window.DemoComponent;
        console.log('Component from DemoComponent function:', typeof Component, Component);
      }
      
      console.log('Final Component:', typeof Component, Component);
      
      if (Component) {
        const rootElement = document.getElementById('root');
        console.log('Rendering component to root element');
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(Component));
      } else {
        console.error('Component not found in any expected location');
        document.getElementById('root').innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component loaded but not found.</p><p class="text-xs mt-2 text-gray-500">Check console for details</p></div>';
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      document.getElementById('root').innerHTML = '<div class="p-4 text-center text-red-500"><h2 class="text-xl font-bold mb-2">Error</h2><p>Failed to render component: ' + error.message + '</p><p class="text-xs mt-2">Check console for details</p></div>';
    }
    
    console.log('=== End Component Detection Debug Info ===');
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