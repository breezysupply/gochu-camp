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
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-black text-white text-center py-2 font-bold">
        NEXT GOCHUCON: JANUARY 17-19
      </div>
      <nav className="border-b border-gray-800 bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-white">GOCHUCON!</div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="text-gray-300 hover:text-white px-4 py-2 text-sm rounded-md border border-gray-600 hover:border-gray-500 bg-[#1e293b]"
              >
                Switch to Windows XP
              </button>
              <button
                onClick={onSignOut}
                className="bg-purple-600 text-white px-4 py-2 text-sm rounded-md hover:bg-purple-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="text-white">
        <div className="text-center py-20 px-4">
          <h1 className="text-6xl font-bold tracking-tight text-purple-400 sm:text-7xl drop-shadow-lg">
            LGTB
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto font-medium">
            Dem gochu boys are planning again!
          </p>
          <div className="mt-12 flex justify-center">
            <img 
              src="/hehe.png" 
              alt="hehe" 
              className="max-w-xl w-full"
            />
          </div>
        </div>
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {React.Children.map(children, (child) => (
              <div className="bg-[#1e293b] rounded-lg shadow-xl border border-gray-700 p-6 hover:border-purple-500 transition-colors overflow-x-auto">
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
