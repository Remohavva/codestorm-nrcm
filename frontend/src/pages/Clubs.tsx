import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clubsAPI } from '../services/api';
import { Users, Plus, Calendar, User, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Clubs: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubsAPI.getAll();
      setClubs(response.data.data.clubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary-400" />
            Clubs
          </h1>
          <p className="mt-2 text-xl text-gray-400">
            Discover and join college clubs
          </p>
        </div>
        
        {(user?.role === 'club_lead' || user?.role === 'admin') && (
          <Link
            to="/clubs/create"
            className="btn-primary flex items-center group"
          >
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Create Club
          </Link>
        )}
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto h-16 w-16 text-gray-600 mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">No clubs found</h3>
          <p className="text-gray-400 mb-8">
            Be the first to create a club and start building your community.
          </p>
          {(user?.role === 'club_lead' || user?.role === 'admin') && (
            <Link
              to="/clubs/create"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Club
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="card group hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors mb-2">
                    {club.name}
                  </h3>
                  {club.description && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {club.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {club.lead && (
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="h-4 w-4 mr-2 text-primary-400" />
                    <span>Led by {club.lead.name}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                  <span>{club.event_count || 0} events</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <Link
                  to={`/clubs/${club.id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center group"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {user?.role === 'student' && (
                  <button className="btn-primary text-sm">
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clubs;