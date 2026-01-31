# Admin Monitoring System - Complete Guide

## 🚀 Overview

The admin monitoring system provides comprehensive oversight and management capabilities for the campus event management platform. It includes real-time analytics, user management, event approval workflows, and system monitoring.

## 📊 Features

### 1. **Analytics Dashboard**
- **Key Metrics**: Total users, clubs, events, registrations, attendance
- **User Breakdown**: Students, club leaders, admins
- **Event Status**: Pending, approved, rejected events
- **30-Day Trends**: New users, clubs, events, registrations
- **Top Clubs**: Ranked by event count

### 2. **Event Management**
- **Pending Approvals**: Queue of events awaiting admin approval
- **Event Filtering**: Filter by status (all, pending, approved, rejected)
- **Bulk Actions**: Approve/reject events with one click
- **Event Details**: View registrations, capacity, club info
- **Pagination**: Handle large event lists efficiently

### 3. **User Management**
- **User Search**: Find users by name or email
- **Role Management**: Change user roles (student → club_lead → admin)
- **User Statistics**: Registration counts, club memberships
- **Filtering**: Filter by role type
- **User Profiles**: View detailed user information

### 4. **Real-time Monitoring**
- **System Health**: Uptime, response times, active users
- **Live Metrics**: Real-time event and registration counts
- **Activity Feed**: Recent user actions and system events
- **Quick Actions**: Direct access to common admin tasks
- **Auto-refresh**: Updates every 30 seconds

## 🔐 Access Control

### Admin Authentication
- **Role Required**: `admin` role in the database
- **Protected Routes**: All admin pages require authentication
- **Token Validation**: JWT-based authentication with role checking

### Admin User Creation
```sql
-- Create an admin user in the database
INSERT INTO users (name, email, role) 
VALUES ('Admin User', 'admin@university.edu', 'admin');
```

## 🛠 Technical Implementation

### Backend Endpoints

#### Analytics
- `GET /api/admin/analytics` - Dashboard statistics
- `GET /api/admin/events/pending` - Pending events

#### Event Management
- `GET /api/admin/events` - All events with pagination
- `PUT /api/admin/events/:id/status` - Approve/reject events

#### User Management
- `GET /api/admin/users` - All users with pagination
- `PUT /api/admin/users/:id/role` - Update user roles

### Frontend Components

#### Main Dashboard (`AdminDashboard.jsx`)
- Tab-based navigation
- Overview analytics
- Component routing

#### Event Management (`EventManagement.jsx`)
- Event approval workflow
- Filtering and pagination
- Real-time updates

#### User Management (`UserManagement.jsx`)
- User search and filtering
- Role assignment interface
- User statistics

#### Monitoring Panel (`MonitoringPanel.jsx`)
- Real-time metrics
- Activity feed
- System health indicators

## 📱 Usage Guide

### 1. **Accessing Admin Dashboard**
1. Login with admin credentials
2. Navigate to `/admin/dashboard`
3. Use tab navigation to switch between sections

### 2. **Approving Events**
1. Go to "Events" tab
2. Review pending events in the alert box
3. Click "Approve" or "Reject" for each event
4. Use filters to manage large event lists

### 3. **Managing Users**
1. Go to "Users" tab
2. Search for specific users
3. Click "Edit Role" to change user permissions
4. Filter by role to find specific user types

### 4. **Monitoring System**
1. Go to "Monitoring" tab
2. View real-time system health
3. Check recent activity feed
4. Use quick actions for common tasks

## 🎨 UI/UX Features

### Design Elements
- **Glass Morphism**: Translucent cards with backdrop blur
- **Animated Background**: Dynamic light beams
- **Color Coding**: Status-based color schemes
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Optimized for extended use

### Interactive Elements
- **Real-time Updates**: Auto-refreshing data
- **Smooth Transitions**: Hover effects and animations
- **Loading States**: Clear feedback during operations
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

### Database Setup
Ensure the following tables exist with proper permissions:
- `users` (with role column)
- `clubs`
- `events` (with status column)
- `registrations`
- `attendance`
- `notifications`

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
```bash
# Build frontend
cd frontend
npm run build

# Deploy backend with PM2
cd backend
pm2 start server.js --name "campus-backend"
```

## 📈 Monitoring Metrics

### Key Performance Indicators
- **User Growth**: New registrations per month
- **Event Activity**: Events created vs. approved
- **Engagement**: Registration rates and attendance
- **System Health**: Response times and uptime

### Alerts and Notifications
- High-capacity events (>90% full)
- Pending events requiring approval
- System performance issues
- Unusual user activity patterns

## 🔍 Troubleshooting

### Common Issues

#### 1. **Admin Dashboard Not Loading**
- Check user role in database
- Verify authentication token
- Ensure backend is running

#### 2. **Event Approval Not Working**
- Check admin permissions
- Verify API endpoints
- Check network connectivity

#### 3. **Real-time Updates Not Working**
- Check WebSocket connections
- Verify polling intervals
- Check browser console for errors

### Debug Commands
```bash
# Check backend logs
npm run dev

# Test API endpoints
curl http://localhost:3000/api/admin/analytics

# Check database connections
npm run test:db
```

## 🔮 Future Enhancements

### Planned Features
- **Advanced Analytics**: Charts and graphs
- **Bulk Operations**: Mass user/event management
- **Audit Logs**: Track all admin actions
- **Email Notifications**: Automated alerts
- **Export Functionality**: Data export to CSV/PDF
- **Custom Dashboards**: Personalized admin views

### Integration Opportunities
- **External APIs**: Campus directory integration
- **Mobile App**: Native admin mobile interface
- **Reporting Tools**: Advanced business intelligence
- **Automation**: Rule-based event approval

## 📞 Support

For technical support or feature requests:
- Check the troubleshooting section
- Review backend logs
- Test API endpoints individually
- Verify database permissions

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Compatibility**: React 19+, Node.js 18+