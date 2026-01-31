import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import LoginDebug from './pages/LoginDebug';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Clubs from './pages/Clubs';
import CreateClub from './pages/CreateClub';
import MyClub from './pages/MyClub';
import UserRegistrations from './pages/UserRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-debug" element={<LoginDebug />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Layout>
                  <Events />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EventDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/events/create"
            element={
              <ProtectedRoute requiredRole="club_lead">
                <Layout>
                  <CreateEvent />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <Layout>
                  <Clubs />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/clubs/create"
            element={
              <ProtectedRoute requiredRole="club_lead">
                <Layout>
                  <CreateClub />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-club"
            element={
              <ProtectedRoute requiredRole="club_lead">
                <Layout>
                  <MyClub />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/registrations"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <UserRegistrations />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
