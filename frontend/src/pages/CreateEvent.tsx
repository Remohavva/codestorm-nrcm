import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, clubsAPI } from '../services/api';
import { Calendar, MapPin, Users, FileText, ArrowLeft, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    club_id: '',
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await clubsAPI.getAll();
      setClubs(response.data.data.clubs);
      
      // If user is club_lead, pre-select their club
      if (user?.role === 'club_lead') {
        const userClub = response.data.data.clubs.find((club: any) => 
          club.lead_id === user.id
        );
        if (userClub) {
          setFormData(prev => ({ ...prev, club_id: userClub.id }));
        }
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventsAPI.create({
        ...formData,
        capacity: parseInt(formData.capacity),
      });
      navigate('/events');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="btn-ghost flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </button>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Plus className="h-8 w-8 mr-3 text-primary-400" />
          Create New Event
        </h1>
        <p className="mt-2 text-xl text-gray-400">
          Create an engaging event for your college community
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field pl-10"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input-field pl-10 resize-none"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                Date & Time *
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                className="input-field"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">
                Capacity *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  required
                  className="input-field pl-10"
                  placeholder="Max attendees"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
              Venue *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="venue"
                name="venue"
                type="text"
                required
                className="input-field pl-10"
                placeholder="Event location"
                value={formData.venue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="club_id" className="block text-sm font-medium text-gray-300 mb-2">
              Organizing Club *
            </label>
            <select
              id="club_id"
              name="club_id"
              required
              className="input-field"
              value={formData.club_id}
              onChange={handleChange}
              disabled={user?.role === 'club_lead'}
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            {user?.role === 'club_lead' && (
              <p className="mt-1 text-xs text-gray-500">
                As a club lead, you can only create events for your club
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-dark-700">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;