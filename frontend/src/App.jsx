import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginSelector from './pages/LoginSelector';
import StudentLogin from './pages/StudentLogin';
import CoordinatorLogin from './pages/CoordinatorLogin';
import SimpleLogin from './pages/SimpleLogin';
import SimpleDashboard from './pages/SimpleDashboard';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import Feed from './pages/student/Feed';
import Events from './pages/student/Events';
import Clubs from './pages/student/Clubs';
import ClubDetail from './pages/student/ClubDetail';
import Registrations from './pages/student/Registrations';
import Discussions from './pages/student/Discussions';
import Profile from './pages/student/Profile';
import EventDetail from './pages/student/EventDetail';
import PastEventDetail from './pages/student/PastEventDetail';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import './App.css';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginSelector />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/coordinator" element={<CoordinatorLogin />} />
        <Route path="/simple-login" element={<SimpleLogin />} />
        <Route path="/simple-dashboard" element={
          <ProtectedRoute>
            <SimpleDashboard />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/student/dashboard/feed" replace />} />
          <Route path="feed" element={<Feed />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="past-events/:id" element={<PastEventDetail />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:id" element={<ClubDetail />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="/coordinator/dashboard" element={
          <ProtectedRoute requiredRole="club_lead">
            <CoordinatorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <CoordinatorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
