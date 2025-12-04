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
        const metaPath = path.join(componentPath, 'meta.json');
        let metaData = {};
        
        // Check if meta.json exists, if not create a minimal one
        if (fs.existsSync(metaPath)) {
          try {
            metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          } catch (err) {
            console.warn(`Error reading meta.json for ${folder}:`, err.message);
            metaData = { name: folder };
          }
        } else {
          // Auto-generate minimal meta data
          metaData = { name: folder };
          fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2));
        }
        
        catalog.push({
          id: folder,
          ...metaData
        });
      }
    });
  }
  
  // Write catalog to both locations
  const catalogJson = JSON.stringify(catalog, null, 2);
  fs.writeFileSync(path.join(__dirname, '..', 'catalog.json'), catalogJson);
  fs.writeFileSync(path.join(__dirname, '..', 'site', 'public', 'catalog.json'), catalogJson);
  
  console.log('Catalog generated successfully!');
}

// Run the function
generateCatalog();