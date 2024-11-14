import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navigation: React.FC = () => {
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-purple-400">GOCHUCONAGRAM</div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/' ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              Packing List
            </Link>
            <Link
              to="/food"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/food' ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              Food List
            </Link>
            <Link
              to="/photos"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/photos' ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              Photo Album
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

