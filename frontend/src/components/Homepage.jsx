import React, { useEffect, useState } from "react"
import {
  MessageCircle,
  Users,
  ChevronRight,
  UserPlus,
  UsersRound,
  Rocket,
  ArrowRight,
  Trophy,
  Medal,
  Award,
  Shield,
  Heart,
  Target,
  Star
} from "lucide-react"

const Grid3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate grid points
  const gridPoints = [];
  const rows = 8;
  const cols = 12;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - cols/2) * 60;
      const y = (i - rows/2) * 60;
      const z = Math.sin((x + mousePosition.x) * 0.02) * Math.cos((y + mousePosition.y) * 0.02) * 20;
      
      gridPoints.push(
        <div
          key={`${i}-${j}`}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
          style={{
            transform: `translate3d(${x + mousePosition.x}px, ${y + mousePosition.y}px, ${z}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="relative w-full h-full perspective-1000">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {gridPoints}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Rocket className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">GuideX</span>
        </div>
        <div className="flex gap-6">
          <button className="text-gray-600 hover:text-blue-600 transition-colors">Login</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md transition-colors flex items-center gap-2">
            Create Account <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section with 3D Grid */}
      <div className="relative min-h-[80vh] flex items-center">
        <Grid3D />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6">GuideX</h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12">
                Empowering growth through meaningful connections
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md inline-flex items-center gap-2 text-lg transition-colors transform hover:scale-105">
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Tiers Section */}
      <div className="container mx-auto mt-32 md:mt-48 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Growth Journey</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Whether you're seeking guidance or sharing expertise, advance through achievement tiers
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Bronze</h3>
              <Medal className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-gray-600 mb-6">Begin Your Journey</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Basic profile features</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Community access</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600">0-5 connections</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Silver</h3>
              <Medal className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">Building Momentum</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Silver badge</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Enhanced matching</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600">5-20 connections</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all relative transform hover:-translate-y-1">
            <div className="absolute -top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Popular
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Gold</h3>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 mb-6">Expert Status</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Verified badge</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Priority features</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600">20-50 connections</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Diamond</h3>
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-6">Elite Recognition</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Elite perks</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Custom features</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600">50+ connections</p>
          </div>
        </div>
      </div>

      {/* Rest of the sections remain the same */}
      {/* How It Works section */}
      <div className="container mx-auto mt-32 md:mt-48 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <UserPlus className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
            <p className="text-gray-600">
              Sign up and customize your experience based on your goals
            </p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <UsersRound className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Connect & Engage</h3>
            <p className="text-gray-600">
              Find your perfect match and start meaningful conversations
            </p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Advance & Achieve</h3>
            <p className="text-gray-600">Progress through tiers as you grow and contribute</p>
          </div>
        </div>
      </div>

      {/* Join Community */}
      <div className="container mx-auto mt-32 md:mt-48 px-6 mb-24">
        <div className="bg-white rounded-2xl p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start your journey today and progress from Bronze to Diamond. Connect, learn, and grow
              together in a supportive environment designed for success.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg transition-colors flex items-center gap-2">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <div className="w-full h-full bg-blue-600 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">GuideX</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p className="text-gray-600">© 2024 GuideX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage;