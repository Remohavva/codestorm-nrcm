'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiUserGroup, HiCalendar, HiTag, HiArrowRight } from 'react-icons/hi';
import { clubs } from '@/lib/mockData';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function ClubsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technology', 'Arts', 'Academic', 'Business'];

  const filteredClubs = selectedCategory === 'All' 
    ? clubs 
    : clubs.filter(club => club.category === selectedCategory);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Explore Clubs</h1>
              <p className="text-gray-400">Discover and join clubs that match your interests</p>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-white to-gray-100 text-black shadow-lg shadow-white/20'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Clubs Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
                >
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* Club Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-gray-600/30 group-hover:border-gray-500/50 transition-colors duration-300">
                        {club.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">{club.name}</h3>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{club.category}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">{club.description}</p>

                    {/* Stats */}
                    <div className="flex gap-6 py-3 mb-4 border-t border-b border-gray-700/50 group-hover:border-gray-600/50 transition-colors duration-300">
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        <HiUserGroup className="w-4 h-4" />
                        <span className="text-sm">{club.members} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        <HiCalendar className="w-4 h-4" />
                        <span className="text-sm">{club.events} events</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-md text-xs text-gray-300 group-hover:bg-gray-700/50 group-hover:border-gray-600/50 group-hover:text-gray-200 transition-all duration-300"
                        >
                          <HiTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Upcoming Event */}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 mb-4 border border-gray-700/30 group-hover:bg-gray-700/30 group-hover:border-gray-600/30 transition-all duration-300">
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Upcoming:</span>
                      <p className="text-sm text-white font-medium group-hover:text-gray-100 transition-colors duration-300">{club.upcomingEvent}</p>
                    </div>

                    {/* View Button */}
                    <button 
                      onClick={() => router.push(`/clubs/${club.id}`)}
                      className="w-full bg-gradient-to-r from-white to-gray-100 text-black py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-white/10 group-hover:transform group-hover:scale-[1.02]"
                    >
                      View Club
                      <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}