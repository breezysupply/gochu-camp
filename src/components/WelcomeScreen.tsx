import SignIn from "./SignIn";

const WelcomeScreen: React.FC = () => (
  <div className="welcome-screen p-8 max-w-2xl mx-auto bg-gray-900 text-white">
    <h1 className="text-6xl font-bold mb-8 text-center text-purple-400">GOCHUCONAGRAM</h1>
    <p className="mb-4 text-gray-300">
      Your ultimate camping companion for GochuCon planning and memories.
    </p>
    <SignIn />
  </div>
);

export default WelcomeScreen;
