import { useState, useEffect } from 'react';
import { 
  HiUsers, 
  HiMail, 
  HiCalendar,
  HiUserGroup,
  HiClipboardList,
  HiFilter,
  HiSearch,
  HiPencil,
  HiShieldCheck
} from 'react-icons/hi';
import { adminAPI } from '../../services/api';
import GlassCard from '../GlassCard';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 15,
        ...(filter !== 'all' && { role: filter }),
        ...(searchTerm && { search: searchTerm })
      };
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10';
      case 'club_lead': return 'text-purple-400 bg-purple-400/10';
      case 'student': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <HiShieldCheck size={16} />;
      case 'club_lead': return <HiUserGroup size={16} />;
      case 'student': return <HiUsers size={16} />;
      default: return <HiUsers size={16} />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <HiFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="club_lead">Club Leaders</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No users found</div>
        ) : (
          filteredUsers.map(user => (
            <GlassCard key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <HiMail size={16} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HiCalendar size={16} />
                        <span>Joined {formatDate(user.created_at)}</span>
                      </div>
                      {user.club_count !== undefined && (
                        <div className="flex items-center space-x-2">
                          <HiUserGroup size={16} />
                          <span>{user.club_count} clubs</span>
                        </div>
                      )}
                      {user.registration_count !== undefined && (
                        <div className="flex items-center space-x-2">
                          <HiClipboardList size={16} />
                          <span>{user.registration_count} registrations</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {editingUser === user.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1 text-sm"
                      >
                        <option value="student">Student</option>
                        <option value="club_lead">Club Leader</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <HiPencil size={14} />
                      <span>Edit Role</span>
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-400">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Next
        </button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {users.filter(u => u.role === 'student').length}
            </div>
            <div className="text-gray-400 text-sm">Students</div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {users.filter(u => u.role === 'club_lead').length}
            </div>
            <div className="text-gray-400 text-sm">Club Leaders</div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-gray-400 text-sm">Admins</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default UserManagement;