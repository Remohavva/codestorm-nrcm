import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clubsAPI } from '../services/api';
import { Users, FileText, ArrowLeft, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateClub: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await clubsAPI.create(formData);
      navigate('/clubs');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/clubs')}
        className="btn-ghost flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Clubs
      </button>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Plus className="h-8 w-8 mr-3 text-primary-400" />
          Create New Club
        </h1>
        <p className="mt-2 text-xl text-gray-400">
          Start a new club and build your community
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Club Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field pl-10"
                placeholder="Enter club name"
                value={formData.name}
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
                rows={6}
                className="input-field pl-10 resize-none"
                placeholder="Describe your club's mission, activities, and goals..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Help students understand what your club is about and why they should join
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-200 mb-2">Club Leadership</h3>
            <p className="text-xs text-blue-300">
              You will automatically become the club lead for this new club. As a club lead, you can:
            </p>
            <ul className="mt-2 text-xs text-blue-300 space-y-1">
              <li>• Create and manage events for your club</li>
              <li>• View club analytics and member engagement</li>
              <li>• Update club information and description</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-dark-700">
            <button
              type="button"
              onClick={() => navigate('/clubs')}
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
                  Create Club
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClub;