import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center text-center p-8">
      <Header />
      <h1 className="text-5xl font-extrabold text-blue-800 mb-6 drop-shadow-lg">
        Discover Powerful Features of TaskBucket
      </h1>
      <p className="text-xl text-gray-700 mb-10 max-w-3xl">
        Our TaskBucket App is designed to streamline your daily tasks and boost your productivity. Here's how it helps you stay on top of everything:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl w-full">
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Intuitive Task Management</h3>
          <p className="text-gray-600">Easily add, update, and delete tasks. Keep your to-do list current and prioritize what matters most with status and priority settings.</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Smart Reminders & Alarms</h3>
          <p className="text-gray-600">Never miss a deadline or an important task. Set custom reminders and alarms to get timely notifications directly on your device.</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Visual Task Association</h3>
          <p className="text-gray-600">Enhance your tasks with images. Attach relevant visuals to your tasks for better context and recall, making your list more engaging.</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Seamless Cross-Device Sync</h3>
          <p className="text-gray-600">Your tasks are always with you. Our app ensures real-time synchronization across all your devices, so you're always updated.</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Secure & Reliable</h3>
          <p className="text-gray-600">Your data is safe with us. We use robust security measures to protect your information and ensure high availability.</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Affordable Pricing</h3>
          <p className="text-gray-600">Start for free! Our flexible pricing tiers cater to individuals and teams of all sizes, offering premium features at competitive rates.</p>
        </div>
      </div>

      <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-blue-300/50">
        Back to Home
      </Link>

      <footer className="mt-auto text-gray-600 text-sm mt-12">
        © {new Date().getFullYear()} TaskBucket. Designed by Habeeb Oladapo. Inspired by DevTown Academy.
      </footer>
    </div>
  );
} 