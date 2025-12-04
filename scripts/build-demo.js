const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to build demos for all components
function buildDemos() {
  const componentsDir = path.join(__dirname, '..', 'components');
  const demosOutputDir = path.join(__dirname, '..', 'site', 'public', 'demos');
  
  // Create demos directory if it doesn't exist
  if (!fs.existsSync(demosOutputDir)) {
    fs.mkdirSync(demosOutputDir, { recursive: true });
  }
  
  // Check if components directory exists
  if (!fs.existsSync(componentsDir)) {
    console.log('No components directory found');
    return;
  }
  
  const componentFolders = fs.readdirSync(componentsDir);
  
  componentFolders.forEach(folder => {
    const componentPath = path.join(componentsDir, folder);
    const stat = fs.statSync(componentPath);
    
    if (stat.isDirectory()) {
      const demoPath = path.join(componentPath, 'demo.tsx');
      
      // Check if demo.tsx exists
      if (fs.existsSync(demoPath)) {
        try {
          // Create a temporary HTML file for this demo
          const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${folder} Demo</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide-react@latest"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    import React, { useState } from 'https://esm.sh/react';
    import ReactDOM from 'https://esm.sh/react-dom/client';
    import * as LucideIcons from 'https://esm.sh/lucide-react';
    
    // Make Lucide icons available globally
    window.LucideIcons = LucideIcons;
    
    // Import the demo component
    const DemoComponent = (() => {
      const exports = {};
      const require = (module) => {
        if (module === 'react') return React;
        if (module === 'lucide-react') return LucideIcons;
        return {};
      };
      
      // Component code will be injected here
      ${fs.readFileSync(demoPath, 'utf8')}
      
      return exports.default || exports;
    })();
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(DemoComponent));
  </script>
</body>
</html>
          `.trim();
          
          // Write the HTML file
          const outputPath = path.join(demosOutputDir, `${folder}.html`);
          fs.writeFileSync(outputPath, htmlContent);
          console.log(`Built demo for ${folder}`);
        } catch (err) {
          console.error(`Error building demo for ${folder}:`, err.message);
        }
      } else {
        console.log(`No demo.tsx found for ${folder}`);
      }
    }
  });
  
  console.log('Demo build completed!');
}

// Run the function
buildDemos();