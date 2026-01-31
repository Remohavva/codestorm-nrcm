import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { attendanceAPI, eventsAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowLeft,
  UserCheck,
  Calendar,
  MapPin
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../lib/utils';

const Attendance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventAndAttendance();
    }
  }, [id]);

  const fetchEventAndAttendance = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await eventsAPI.getById(id!);
      setEvent(eventResponse.data.data.event);
      
      // Fetch attendance if user has permission
      if (user?.role === 'club_lead' || user?.role === 'admin') {
        const attendanceResponse = await attendanceAPI.getEventAttendance(id!);
        setAttendance(attendanceResponse.data.data.attendance);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (userId?: string) => {
    try {
      setCheckingIn(true);
      await attendanceAPI.checkIn(id!, userId);
      fetchEventAndAttendance(); // Refresh data
    } catch (error: any) {
      alert(error.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <Calendar className="mx-auto h-16 w-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Event not found</h3>
        <Button onClick={() => navigate('/events')} variant="outline">
          Back to Events
        </Button>
      </div>
    );
  }

  const isEventDay = new Date(event.date).toDateString() === new Date().toDateString();
  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/events')}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.venue}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.capacity} capacity
                  </div>
                </div>
              </CardDescription>
            </div>
            <Badge variant={event.status === 'approved' ? 'success' : 'secondary'}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Student Check-in */}
      {user?.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Event Check-in</CardTitle>
            <CardDescription>
              {isEventDay 
                ? 'Check in to confirm your attendance at this event'
                : isEventPast 
                  ? 'This event has already occurred'
                  : 'Check-in will be available on the event day'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleCheckIn()}
              disabled={!isEventDay || checkingIn}
              className="w-full sm:w-auto"
            >
              {checkingIn ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check In
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Attendance Management (Club Leads & Admins) */}
      {(user?.role === 'club_lead' || user?.role === 'admin') && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Management</CardTitle>
            <CardDescription>
              View and manage event attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-400">Registered</p>
                      <p className="text-lg font-semibold text-white">
                        {event.registration_count || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-400">Attended</p>
                      <p className="text-lg font-semibold text-white">
                        {attendance.length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-400">Attendance Rate</p>
                      <p className="text-lg font-semibold text-white">
                        {event.registration_count > 0 
                          ? Math.round((attendance.length / event.registration_count) * 100)
                          : 0
                        }%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance List */}
              {attendance.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Attendees</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attendance.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {record.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {record.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Checked in at
                          </p>
                          <p className="text-sm text-white">
                            {formatDate(record.checked_in_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-400">No attendees yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Attendance;