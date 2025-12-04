const fs = require('fs');
const path = require('path');

// Function to scan components and generate catalog
function generateCatalog() {
  const componentsDir = path.join(__dirname, '..', 'components');
  const catalog = [];
  
  // Check if components directory exists
  if (fs.existsSync(componentsDir)) {
    const componentFolders = fs.readdirSync(componentsDir);
    
    componentFolders.forEach(folder => {
      const componentPath = path.join(componentsDir, folder);
      const stat = fs.statSync(componentPath);
      
      if (stat.isDirectory()) {
        const indexPath = path.join(componentPath, 'index.tsx');
        const demoPath = path.join(componentPath, 'demo.tsx');
        
        // Only process folders that contain index.tsx or demo.tsx
        if (fs.existsSync(indexPath) || fs.existsSync(demoPath)) {
          const metaPath = path.join(componentPath, 'meta.json');
          
          let metaData = {
            id: folder,
            title: folder,
            description: '',
            tags: [],
            codePath: `/components/${folder}/index.tsx`,
            demoPath: `/demos/${folder}.html`,
            updatedAt: new Date().toISOString()
          };
          
          // Read meta.json if it exists
          if (fs.existsSync(metaPath)) {
            try {
              const metaContent = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
              metaData = {
                ...metaData,
                ...metaContent,
                id: folder,
                title: metaContent.name || metaContent.title || folder,
                codePath: `/components/${folder}/index.tsx`,
                demoPath: `/demos/${folder}.html`
              };
            } catch (err) {
              console.warn(`Error reading meta.json for ${folder}:`, err.message);
            }
          }
          
          // Get file stats for updated time
          const fileToCheck = fs.existsSync(indexPath) ? indexPath : demoPath;
          const fileStat = fs.statSync(fileToCheck);
          metaData.updatedAt = fileStat.mtime.toISOString();
          
          catalog.push(metaData);
        }
      }
    });
  }
  
  // Sort catalog by id
  catalog.sort((a, b) => a.id.localeCompare(b.id));
  
  // Write catalog to both locations
  const catalogJson = JSON.stringify(catalog, null, 2);
  fs.writeFileSync(path.join(__dirname, '..', 'catalog.json'), catalogJson);
  fs.writeFileSync(path.join(__dirname, '..', 'site', 'public', 'catalog.json'), catalogJson);
  
  console.log('Catalog generated successfully!');
  console.log(`Generated catalog with ${catalog.length} components`);
  
  // Exit with non-zero on fatal errors
  if (catalog.length === 0) {
    console.log('Warning: No components found');
  }
}

// Run the function
try {
  generateCatalog();
} catch (err) {
  console.error('Fatal error generating catalog:', err.message);
  process.exit(1);
}