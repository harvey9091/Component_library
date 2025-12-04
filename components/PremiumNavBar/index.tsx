import React, { useMemo, useState, useEffect } from 'react';
import { House, Heart, Plus, User, Bell } from 'lucide-react';

// Define the type for our tab items
interface TabItem {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

interface PremiumNavBarProps {
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

const PremiumNavBar: React.FunctionComponent<PremiumNavBarProps> = ({ 
  activeTabId = 'home', 
  onTabChange = () => {} 
}) => {
  const tabs: TabItem[] = useMemo(() => [
    { id: 'home', icon: House, label: 'Home' },
    { id: 'heart', icon: Heart, label: 'Likes' },
    { id: 'add', icon: Plus, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notify' }
  ], []);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTabId);
    if (index !== -1) setActiveIndex(index);
  }, [activeTabId, tabs]);

  return (
    <nav className="relative w-full max-w-[400px]" role="navigation">
      <div className="relative flex h-20 w-full items-center justify-between rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-60" />
        
        {/* Active tab indicator */}
        <div 
          className="absolute inset-y-0 left-0 pointer-events-none transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
          style={{ 
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`
          }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-end">
            <div className="w-full h-full bg-gradient-to-t from-red-600/20 via-red-500/5 to-transparent opacity-100 blur-md" />
            <div className="absolute bottom-0 h-[2px] w-8 rounded-full bg-red-500 shadow-[0_-2px_15px_2px_rgba(239,68,68,0.8)] z-20" />
          </div>
        </div>

        {/* Tab buttons */}
        <div className="relative z-20 flex w-full h-full justify-between items-center">
          {tabs.map((tab, index) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange && onTabChange(tab.id)}
                className="group relative flex flex-1 items-center justify-center outline-none h-full"
                aria-label={tab.label}
                type="button"
              >
                <div className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out">
                  <Icon
                    className={`
                      relative z-10 transition-colors duration-300
                      ${isActive 
                        ? 'text-white drop-shadow-[0_0_12px_rgba(239,68,68,1)]' 
                        : 'text-white/20 group-hover:text-red-400'
                      }
                    `}
                    width={26}
                    height={26}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavBar;