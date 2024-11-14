import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import WindowsDesktop from './components/WindowsDesktop';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen w-screen">
      {user ? <WindowsDesktop /> : <WelcomeScreen />}
    </div>
  );
};

export default App;
