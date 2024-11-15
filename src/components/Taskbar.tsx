import React, { useState, useEffect } from 'react';
import { LogOut, User, Monitor } from 'lucide-react';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';

interface TaskbarProps {
  openWindows: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    isMinimized: boolean;
  }>;
  activeWindow: string | null;
  onWindowClick: (id: string) => void;
  onSignOut: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  openWindows, 
  activeWindow, 
  onWindowClick,
  onSignOut 
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-[#235ADC] to-[#63AAF3] flex items-center justify-between border-t-2 border-[#0A246A]">
      <div className="relative">
        <button 
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`flex items-center h-12 px-4 font-bold text-white
            bg-gradient-to-r from-[#378B44] to-[#4AB854]
            hover:brightness-110
            ${startMenuOpen ? 'bg-[#3C81F3]' : ''}`}
        >
          Start
        </button>

        {startMenuOpen && (
          <div className="absolute bottom-12 left-0 w-64 bg-[#ECE9D8] border-2 border-[#0A246A] rounded-t-lg shadow-xl">
            <div className="bg-gradient-to-r from-[#0A246A] to-[#A6CAF0] p-4 text-white">
              <div className="flex items-center gap-3">
                <User size={48} />
                <span className="font-bold">{auth.currentUser?.displayName || 'User'}</span>
              </div>
            </div>

            <div className="p-2">
              <button 
                onClick={() => {
                  setStartMenuOpen(false);
                  toggleTheme();
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-[#316AC5] hover:text-white rounded mb-2"
              >
                <Monitor size={20} />
                <span>Change to modern experience</span>
              </button>
            </div>

            <div className="p-2">
              <button 
                onClick={onSignOut}
                className="w-full flex items-center gap-2 p-2 hover:bg-[#316AC5] hover:text-white rounded"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center px-2 gap-1">
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onWindowClick(window.id)}
            className={`flex items-center gap-2 px-2 py-1 min-w-[120px] h-8 rounded
              ${activeWindow === window.id 
                ? 'bg-[#3C81F3] text-white' 
                : window.isMinimized
                  ? 'bg-[#ECE9D8]'
                  : 'bg-[#ECE9D8] hover:bg-[#316AC5] hover:text-white'}`}
          >
            {window.icon}
            <span className="truncate">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center bg-[#ECE9D8] h-full px-3 border-l border-[#0A246A]">
        <span className="text-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default Taskbar;
