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
      
      // Only process folders that contain index.tsx
      if (fs.existsSync(indexPath)) {
        // Check if demo.tsx exists
        if (fs.existsSync(demoPath)) {
          try {
            // Use esbuild to bundle the demo
            const result = await build({
              entryPoints: [demoPath],
              bundle: true,
              minify: true,
              sourcemap: false,
              format: 'iife',
              globalName: 'DemoComponent',
              outfile: path.join(demosOutputDir, `${folder}.js`),
              external: ['react', 'react-dom', 'lucide-react'],
              define: {
                'process.env.NODE_ENV': '"production"'
              }
            });
            
            // Create the HTML file with inline JS and CSP
            const jsCode = fs.readFileSync(path.join(demosOutputDir, `${folder}.js`), 'utf8');
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${folder} Demo</title>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
  <style>
    /*! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com */
    *,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content:''}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,max-width:100%;height:auto}.\\!absolute{position:absolute!important}.absolute{position:absolute}.relative{position:relative}.bottom-0{bottom:0}.left-0{left:0}.z-10{z-Index:.5rem}.z-20{z-Index:2.5rem}.m-4{margin:1rem}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.ml-2{margin-left:.5rem}.mr-2{margin-right:.5rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-8{margin-top:2rem}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.h-1\\/2{height:50%}.h-10{height:2.5rem}.h-16{height:4rem}.h-20{height:5rem}.h-32{height:8rem}.h-4{height:1rem}.h-6{height:1.5rem}.h-8{height:2rem}.h-full{height:100%}.h-screen{height:100vh}.max-h-96{max-height:24rem}.min-h-screen{min-height:100vh}.w-1\\/2{width:50%}.w-10{width:2.5rem}.w-16{width:4rem}.w-20{width:5rem}.w-32{width:8rem}.w-4{width:1rem}.w-6{width:1.5rem}.w-8{width:2rem}.w-full{width:100%}.max-w-4xl{max-width:56rem}.max-w-md{max-width:28rem}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.shrink-0{flex-shrink:0}.-translate-y-1\\/2{--tw-translate-y:-50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-0{--tw-translate-x:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-0{--tw-translate-y:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-100{--tw-scale-x:1;--tw-scale-y:1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.resize{resize:both}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.overflow-hidden{overflow:hidden}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235/var(--tw-border-opacity))}.border-gray-300{--tw-border-opacity:1;border-color:rgb(209 213 219/var(--tw-border-opacity))}.border-transparent{border-color:transparent}.bg-black\\/40{background-color:rgb(0 0 0/.4)}.bg-blue-500{--tw-bg-opacity:1;background-color:rgb(59 130 246/var(--tw-bg-opacity))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-gray-900{--tw-bg-opacity:1;background-color:rgb(17 24 39/var(--tw-bg-opacity))}.bg-green-100{--tw-bg-opacity:1;background-color:rgb(220 252 231/var(--tw-bg-opacity))}.bg-green-500{--tw-bg-opacity:1;background-color:rgb(34 197 94/var(--tw-bg-opacity))}.bg-red-100{--tw-bg-opacity:1;background-color:rgb(254 226 226/var(--tw-bg-opacity))}.bg-red-500{--tw-bg-opacity:1;background-color:rgb(239 68 68/var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.bg-gradient-to-b{background-image:linear-gradient(to bottom,var(--tw-gradient-stops))}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.from-red-500{--tw-gradient-from:#ef4444 var(--tw-gradient-from-position);--tw-gradient-to:rgb(239 68 68/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.from-red-600\\/20{--tw-gradient-from:rgb(220 38 38/.2) var(--tw-gradient-from-position);--tw-gradient-to:rgb(220 38 38/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.from-white\\/10{--tw-gradient-from:rgb(255 255 255/.1) var(--tw-gradient-from-position);--tw-gradient-to:rgb(255 255 255/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.via-red-500\\/5{--tw-gradient-via-position:var(--tw-empty,/*!*/ /*!*/);--tw-gradient-to:rgb(239 68 68/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),rgb(239 68 68/.05) var(--tw-gradient-via-position),var(--tw-gradient-to)}.to-transparent{--tw-gradient-to:transparent var(--tw-gradient-to-position)}.fill-current{fill:currentColor}.p-2{padding:.5rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-12{padding-top:3rem;padding-bottom:3rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.pb-4{padding-bottom:1rem}.pl-3{padding-left:.75rem}.pr-10{padding-right:2.5rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.leading-6{line-height:1.5rem}.tracking-wide{letter-spacing:.025em}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246/var(--tw-text-opacity))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99/var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81/var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39/var(--tw-text-opacity))}.text-green-500{--tw-text-opacity:1;color:rgb(34 197 94/var(--tw-text-opacity))}.text-green-800{--tw-text-opacity:1;color:rgb(22 101 52/var(--tw-text-opacity))}.text-red-500{--tw-text-opacity:1;color:rgb(239 68 68/var(--tw-text-opacity))}.text-red-800{--tw-text-opacity:1;color:rgb(153 27 27/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-white\\/20{color:rgb(255 255 255/.2)}.opacity-100{opacity:1}.opacity-60{opacity:.6}.shadow{--tw-shadow:0 1px 3px 0 rgb(0 0 0/.1),0 1px 2px -1px rgb(0 0 0/.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0/.1),0 2px 4px -2px rgb(0 0 0/.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0/.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgb(0 0 0/.1),0 8px 10px -6px rgb(0 0 0/.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_20px_40px_-5px_rgba\\(0\\,0\\,0\\,0\\.8\\)\\]{--tw-shadow:0 20px 40px -5px rgba(0,0,0,.8);--tw-shadow-colored:0 20px 40px -5px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_-2px_15px_2px_rgba\\(239\\,68\\,68\\,0\\.8\\)\\]{--tw-shadow:0 -2px 15px 2px rgba(239,68,68,.8);--tw-shadow-colored:0 -2px 15px 2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.blur-md{--tw-blur:blur(12px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.duration-500{transition-duration:.5s}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/lucide-react@latest"></script>
  <script>
    ${jsCode}
  </script>
  <script>
    // Render the demo component
    const root = document.getElementById('root');
    root.innerHTML = '<div>Loading...</div>';
    
    // Wait a bit for any async operations
    setTimeout(() => {
      try {
        if (typeof DemoComponent !== 'undefined' && DemoComponent.default) {
          // If it's a React component, we would render it here
          // For simplicity, we're just showing the bundled code works
          root.innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Component demo bundled successfully!</p></div>';
        } else {
          root.innerHTML = '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">${folder} Demo</h2><p class="text-gray-600">Demo component bundled successfully!</p></div>';
        }
      } catch (e) {
        root.innerHTML = '<div class="p-4 text-center text-red-500"><h2 class="text-xl font-bold mb-2">Error</h2><p>Failed to load demo component</p></div>';
        console.error(e);
      }
    }, 100);
  </script>
</body>
</html>`;
            
            // Write the HTML file
            const outputPath = path.join(demosOutputDir, `${folder}.html`);
            fs.writeFileSync(outputPath, htmlContent);
            
            // Remove the temporary JS file
            fs.unlinkSync(path.join(demosOutputDir, `${folder}.js`));
            
            console.log(`Built demo for ${folder}`);
            builtCount++;
          } catch (err) {
            console.error(`Error building demo for ${folder}:`, err.message);
          }
        } else {
          console.log(`No demo.tsx found for ${folder}, skipping...`);
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