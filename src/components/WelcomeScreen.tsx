import SignIn from "./SignIn";
import { useState, useEffect } from 'react';
import { incrementVisitorCount } from '../firebase';

const WelcomeScreen: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = async () => {
      const count = await incrementVisitorCount();
      setVisitorCount(count);
    };
    updateCount();
  }, []);

  const displayCount = visitorCount === null 
    ? '------' 
    : visitorCount.toString().padStart(6, '0');

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div style={{ 
        backgroundImage: 'url("/backgrounds/stars.gif")',
        backgroundRepeat: 'repeat'
      }}>
        <div className="max-w-4xl mx-auto border-4 border-blue-500 p-8 bg-black">
          <div className="text-center mb-8">
            <img src="/gifs/flame.gif" alt="" className="inline-block h-8" />
            <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text" 
                style={{ fontFamily: 'Comic Sans MS' }}>
              GOCHUCON
            </h1>
            <img src="/gifs/flame.gif" alt="" className="inline-block h-8 transform scale-x-[-1]" />
          </div>
          
          <marquee className="mb-4 text-yellow-300">
            ★☆★ Welcome to the ULTIMATE Gochucon Planning Zone! ★☆★
          </marquee>
          
          <div className="text-center mb-8">
            <img src="/gifs/under-construction.gif" alt="" className="inline-block h-12 mx-2" />
            <img src="/gifs/new.gif" alt="" className="inline-block h-12 mx-2" />
          </div>
          
          <p className="text-cyan-400 text-center mb-8" style={{ fontFamily: 'Comic Sans MS' }}>
            Your ultimate camping companion for GochuCon planning and memories!
          </p>
          
          <div className="border-2 border-purple-500 p-4 bg-gray-900">
            <SignIn />
          </div>
          
          <div className="text-center mt-8 flex flex-col items-center gap-2">
            <div className="text-yellow-300" style={{ fontFamily: 'Comic Sans MS' }}>
              Visitor Count:
            </div>
            <div className="bg-black border-2 border-blue-500 px-4 py-2 text-green-400 font-mono text-xl">
              004343
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
