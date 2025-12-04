import React, { useState } from 'react';
import PremiumNavBar from './index';

const PremiumNavBarDemo = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-8">Premium Navigation Bar Demo</h1>
      <div className="w-full max-w-md">
        <PremiumNavBar 
          activeTabId={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
      <div className="mt-8 text-white">
        <p>Active Tab: {activeTab}</p>
      </div>
    </div>
  );
};

export default PremiumNavBarDemo;