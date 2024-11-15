import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import WindowsDesktop from './components/WindowsDesktop';
import WelcomeScreen from './components/WelcomeScreen';
import ModernLayout from './components/ModernLayout';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import PackingList from './components/PackingList';
import FoodList from './components/FoodList';
import PhotoAlbum from './components/PhotoAlbum';

const AppContent: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <WelcomeScreen />;
  }

  return theme === 'winxp' ? (
    <WindowsDesktop />
  ) : (
    <ModernLayout onSignOut={() => auth.signOut()}>
      <PackingList />
      <FoodList />
      <PhotoAlbum />
    </ModernLayout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
