import { useState, useEffect } from 'react';

export default function Home() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    fetch('/catalog.json')
      .then(response => response.json())
      .then(data => setCatalog(data))
      .catch(error => console.error('Error loading catalog:', error));
  }, []);

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
                <h2 className="text-xl font-semibold mb-2">{component.name}</h2>
                {component.description && (
                  <p className="text-gray-600">{component.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}