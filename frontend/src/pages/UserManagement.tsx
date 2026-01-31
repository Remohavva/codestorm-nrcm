import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft,
  Shield,
  User,
  Crown,
  GraduationCap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../lib/utils';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers({
        role: filters.role || undefined,
        page: filters.page,
        limit: filters.limit,
      });
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      await adminAPI.updateUserRole(userId, newRole);
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'club_lead':
        return <Crown className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'club_lead':
        return 'warning';
      case 'student':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    user.email.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-400" />
          User Management
        </h1>
        <p className="mt-2 text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="club_lead">Club Leads</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No users found</h3>
            <p className="text-gray-400">
              No users match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        disabled={updating === user.id}
                      >
                        <option value="student">Student</option>
                        <option value="club_lead">Club Lead</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {updating === user.id && (
                        <LoadingSpinner size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of user roles and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Students</p>
                  <p className="text-lg font-semibold text-white">
                    {users.filter(u => u.role === 'student').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Club Leads</p>
                  <p className="text-lg font-semibold text-white">
                    {users.filter(u => u.role === 'club_lead').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-400">Admins</p>
                  <p className="text-lg font-semibold text-white">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;