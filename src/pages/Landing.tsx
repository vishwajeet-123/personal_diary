import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book, Heart, Star, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <Book size={40} className="text-indigo-600" />
        </motion.div>

        <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase">
          Personal Diary App
        </h1>
        <p className="text-white/80 text-sm mb-8 font-medium">
          Your thoughts, secured forever.
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-white/5 rounded-2xl p-4 text-left border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Team Members</h3>
            <ul className="space-y-2 text-sm font-semibold">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-400 rounded-full" /> Vishwajeet U W</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> Shrinivas M</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> Yashwanth H S</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 text-left border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">College</h3>
            <p className="text-sm font-semibold">The National Institute of Engineering, Mysuru</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/login"
            className="bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-500/70 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      <div className="mt-8 flex gap-6 text-white/40">
        <Shield size={20} />
        <Heart size={20} />
        <Star size={20} />
      </div>
    </div>
  );
}
