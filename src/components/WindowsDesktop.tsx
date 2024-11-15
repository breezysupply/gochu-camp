import React, { useState } from 'react';
import { FolderOpen, Image as ImageIcon, Utensils, LogOut } from 'lucide-react';
import PackingList from './PackingList';
import FoodList from './FoodList';
import PhotoAlbum from './PhotoAlbum';
import Window from './Window';
import { auth } from '../firebase';
import Taskbar from './Taskbar';
import { AnimatePresence } from 'framer-motion';

interface DesktopIcon {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const WindowsDesktop: React.FC = () => {
  console.log('WindowsDesktop rendering');
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);

  const desktopIcons: DesktopIcon[] = [
    {
      id: 'packing',
      title: 'Packing List',
      icon: <FolderOpen className="text-yellow-500" size={32} />,
      component: <PackingList />
    },
    {
      id: 'food',
      title: 'Food List',
      icon: <Utensils className="text-blue-500" size={32} />,
      component: <FoodList />
    },
    {
      id: 'photos',
      title: 'Photo Album',
      icon: <ImageIcon className="text-green-500" size={32} />,
      component: <PhotoAlbum />
    }
  ];

  const handleIconClick = (id: string) => {
    if (minimizedWindows.includes(id)) {
      handleRestore(id);
    } else if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
      setActiveWindow(id);
    } else {
      setActiveWindow(id);
    }
  };

  const handleCloseWindow = (id: string) => {
    setOpenWindows(openWindows.filter(windowId => windowId !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows[openWindows.length - 2] || null);
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      auth.signOut();
    }
  };

  const handleMinimize = (id: string) => {
    setMinimizedWindows([...minimizedWindows, id]);
    setActiveWindow(null);
  };

  const handleRestore = (id: string) => {
    setMinimizedWindows(minimizedWindows.filter(windowId => windowId !== id));
    setActiveWindow(id);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-gray-900 text-white text-center py-2 font-bold">
        NEXT GOCHUCON: JANUARY 17-19
      </div>
      <div 
        className="flex-1 relative"
        style={{
          backgroundImage: 'url("/windows-xp/xp-bliss.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Desktop Icons */}
        <div className="grid grid-cols-1 gap-6 p-4">
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              onDoubleClick={() => handleIconClick(icon.id)}
              className="w-24 flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"
            >
              {icon.icon}
              <span className="mt-2 text-white text-sm text-center drop-shadow-lg">
                {icon.title}
              </span>
            </div>
          ))}
        </div>

        {/* Windows */}
        <AnimatePresence>
          {openWindows.map((id) => {
            const icon = desktopIcons.find(icon => icon.id === id);
            if (!icon) return null;
            return (
              <Window
                key={id}
                title={icon.title}
                icon={icon.icon}
                isActive={activeWindow === id}
                isMinimized={minimizedWindows.includes(id)}
                onClose={() => handleCloseWindow(id)}
                onFocus={() => setActiveWindow(id)}
                onMinimize={() => handleMinimize(id)}
                initialPosition={{ x: 20 + openWindows.indexOf(id) * 30, y: 20 + openWindows.indexOf(id) * 30 }}
              >
                {icon.component}
              </Window>
            );
          })}
        </AnimatePresence>
      </div>
      <Taskbar
        openWindows={openWindows.map(id => ({
          id,
          title: desktopIcons.find(i => i.id === id)?.title || '',
          icon: desktopIcons.find(i => i.id === id)?.icon,
          isMinimized: minimizedWindows.includes(id)
        }))}
        activeWindow={activeWindow}
        onWindowClick={handleIconClick}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default WindowsDesktop;
