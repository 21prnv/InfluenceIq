import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for React Router v6+

const DefaultPage = () => {
  const navigate = useNavigate(); // Get navigate function for navigation

  const handleSignIn = () => {
    navigate('/login'); // Navigate to Sign In page
  };

  const handleSignUp = () => {
    navigate('/register'); // Navigate to Register page
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <img
        src="https://pbs.twimg.com/media/GbgpjH4aMAApvJC?format=jpg&name=medium"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30" // Low opacity background
      />
      <div className="relative z-10 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-2xl p-8 shadow-lg">
        <h1 className="font-bold text-4xl mb-6">Welcome to FitTrack</h1>
        <p className="text-lg mb-4 text-center">
          Your ultimate fitness companion that helps you track your workouts,
          manage your nutrition, and achieve your fitness goals.
        </p>
        <p className="text-md mb-8 text-center">
          Join our community of fitness enthusiasts, whether you are a beginner
          or a pro, and make every workout count!
        </p>
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={handleSignIn}
            className="bg-yellow-500 text-white font-semibold rounded-xl p-2 w-64 hover:bg-yellow-600 transition"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="bg-blue-500 text-white font-semibold rounded-xl p-2 w-64 hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </div>
        <div className="text-center mt-8">
          <h2 className="font-semibold text-2xl mb-4">Why Choose FitTrack?</h2>
          <ul className="list-disc list-inside text-left">
            <li>🏋️ Track your workouts and progress effortlessly.</li>
            <li>🍏 Get personalized nutrition advice.</li>
            <li>📊 Analyze your performance with detailed metrics.</li>
            <li>👥 Connect with a community of fitness enthusiasts.</li>
            <li>📅 Set goals and stay motivated with reminders.</li>
          </ul>
        </div>
        <div className="text-center mt-8">
          <h2 className="font-semibold text-2xl mb-4">What Our Users Say</h2>
          <blockquote className="italic text-gray-600 mb-4">
            "FitTrack has transformed my fitness journey. I love how easy it is to
            track my workouts and stay motivated!"
          </blockquote>
          <p className="font-semibold">– Karan k.</p>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
