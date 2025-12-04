import { useState, useEffect } from 'react';
import { toEmbedDemoUrl, resolveEmbed } from '../src/utils/demoUrl';

export default function Home() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    fetch('/catalog.json')
      .then(response => response.json())
      .then(data => setCatalog(data))
      .catch(error => console.error('Error loading catalog:', error));
  }, []);

  const handlePreviewClick = async (demoPath, event) => {
    event.preventDefault();
    const url = toEmbedDemoUrl('harvey9091', 'Component_library', 'main', demoPath);
    
    // Log for debugging
    console.log(`FLUR: loading demo from ${url}`);
    
    // Try a non-blocking HEAD check
    try {
      const resolvedUrl = await resolveEmbed(demoPath);
      console.log(`FLUR: demo URL validation ok`);
      window.open(resolvedUrl, '_blank');
      return;
    } catch (e) {
      console.log(`FLUR: demo URL validation fail`, e);
    }
    
    // Still open the URL even if HEAD check failed
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Component Library</h1>
        
        {catalog.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No components found in the catalog.</p>
            <p className="text-gray-500 mt-2">Add components to the library and run the catalog generation script.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((component) => (
              <div key={component.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{component.title}</h2>
                {component.description && (
                  <p className="text-gray-600 mb-4">{component.description}</p>
                )}
                {component.tags && component.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {component.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {component.demoPath && (
                    <a 
                      href={toEmbedDemoUrl('harvey9091', 'Component_library', 'main', component.demoPath)} 
                      onClick={(e) => handlePreviewClick(component.demoPath, e)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Preview
                    </a>
                  )}
                  {component.codePath && (
                    <a 
                      href={component.codePath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 transition-colors"
                    >
                      Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}