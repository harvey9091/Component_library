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
        const indexPath = path.join(componentPath, 'index.tsx');
        const demoPath = path.join(componentPath, 'demo.tsx');
        
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
        if (fs.existsSync(indexPath)) {
          const fileStat = fs.statSync(indexPath);
          metaData.updatedAt = fileStat.mtime.toISOString();
        }
        
        catalog.push(metaData);
      }
    });
  }
  
  // Sort catalog by id
  catalog.sort((a, b) => a.id.localeCompare(b.id));
  
  // Write catalog to site public directory
  const catalogJson = JSON.stringify(catalog, null, 2);
  fs.writeFileSync(path.join(__dirname, '..', 'site', 'public', 'catalog.json'), catalogJson);
  
  console.log('Catalog generated successfully!');
  console.log(`Generated catalog with ${catalog.length} components`);
}

// Run the function
generateCatalog();