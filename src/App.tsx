import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import { User as FirebaseUser } from "firebase/auth";
import WelcomeScreen from "./components/WelcomeScreen";
import SignIn from "./components/SignIn";
import PackingList from "./components/PackingList";
import FoodList from "./components/FoodList";
import PhotoAlbum from "./components/PhotoAlbum";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app min-h-screen bg-gray-900 text-white">
        {user ? (
          <>
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<PackingList />} />
                <Route path="/food" element={<FoodList />} />
                <Route path="/photos" element={<PhotoAlbum />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<WelcomeScreen />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
