import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, Monitor } from 'lucide-react';

interface ModernLayoutProps {
  children: React.ReactNode;
  onSignOut: () => void;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children, onSignOut }) => {
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">Travel Planner</div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm rounded-md border border-gray-300"
              >
                Switch to Windows XP
              </button>
              <button
                onClick={onSignOut}
                className="bg-gray-900 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="text-center py-20 px-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Plan your trip together
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Effortlessly organize your camping trip with friends. Keep track of packing lists, 
            plan meals together, and share photos of your adventures.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {React.Children.map(children, (child) => (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                {child}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernLayout;
