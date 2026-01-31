'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  HiArrowLeft,
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiUserGroup,
  HiTag,
  HiCurrencyDollar,
  HiExclamationCircle
} from 'react-icons/hi';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { events, coordinatorProfiles } from '@/lib/mockData';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Workshop',
    capacity: '',
    prize: '',
    tags: '',
    requirements: '',
    image: ''
  });

  const coordinatorData = user?.email ? coordinatorProfiles[user.email] : null;
  const eventId = parseInt(params.id);

  useEffect(() => {
    // Find the event and check if coordinator has access
    const foundEvent = events.find(e => e.id === eventId);
    if (foundEvent && coordinatorData && foundEvent.clubId === coordinatorData.clubId) {
      setEvent(foundEvent);
      
      // Parse date and time
      const eventDate = new Date(foundEvent.date);
      const dateStr = eventDate.toISOString().split('T')[0];
      const timeStr = foundEvent.time || eventDate.toTimeString().slice(0, 5);
      
      setFormData({
        title: foundEvent.title || '',
        description: foundEvent.description || '',
        date: dateStr,
        time: timeStr,
        location: foundEvent.location || '',
        type: foundEvent.type || 'Workshop',
        capacity: foundEvent.capacity ? foundEvent.capacity.toString() : '',
        prize: foundEvent.prize || '',
        tags: foundEvent.tags ? foundEvent.tags.join(', ') : '',
        requirements: foundEvent.requirements ? foundEvent.requirements.join(', ') : '',
        image: foundEvent.image || ''
      });
    }
  }, [eventId, coordinatorData]);

  if (!coordinatorData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-400 mb-6">You don't have coordinator access.</p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
              <p className="text-gray-400 mb-6">The event you're trying to edit doesn't exist or you don't have permission to edit it.</p>
              <button 
                onClick={() => router.push('/coordinator')}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would make an API call to update the event
      const updatedEvent = {
        ...event,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
        date: `${formData.date}T${formData.time}:00Z`,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        prize: formData.prize || null
      };

      console.log('Event updated:', updatedEvent);
      alert('Event updated successfully!');
      router.push('/coordinator');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    'Workshop',
    'Competition',
    'Performance',
    'Exhibition',
    'Seminar',
    'Conference',
    'Social',
    'Sports'
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/coordinator')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Edit Event</h1>
              <p className="text-gray-400">Update "{event.title}" for {coordinatorData.clubName}</p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-gray-500/50 focus:outline-none transition-colors"
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Describe your event..."
                  />
                </div>

                {/* Date, Time, Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <HiCalendar className="w-4 h-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-gray-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <HiClock className="w-4 h-4 inline mr-1" />
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-gray-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <HiLocationMarker className="w-4 h-4 inline mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                      placeholder="Event location"
                    />
                  </div>
                </div>

                {/* Capacity and Prize */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <HiUserGroup className="w-4 h-4 inline mr-1" />
                      Capacity (Optional)
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                      placeholder="Maximum participants"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <HiCurrencyDollar className="w-4 h-4 inline mr-1" />
                      Prize (Optional)
                    </label>
                    <input
                      type="text"
                      name="prize"
                      value={formData.prize}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                      placeholder="e.g., ₹10,000"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <HiTag className="w-4 h-4 inline mr-1" />
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                    placeholder="Separate tags with commas (e.g., Programming, AI, Workshop)"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <HiExclamationCircle className="w-4 h-4 inline mr-1" />
                    Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                    placeholder="Separate requirements with commas (e.g., Laptop, Team of 2-4)"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/coordinator')}
                    className="flex-1 bg-gray-800/50 text-white py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-white to-gray-100 text-black py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}