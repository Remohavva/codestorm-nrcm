# Admin Dashboard - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. **Create Admin User**
```bash
# Option A: Run the automated setup script
cd backend
npm run setup:admin

# Option B: Run SQL manually
# Execute the SQL in database/create-admin-user.sql in your Supabase dashboard
```

### 2. **Start Servers**
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend  
cd frontend
npm run dev
```

### 3. **Test Admin Access**
```bash
# Test the admin API endpoints
cd backend
npm run test:admin
```

### 4. **Login to Admin Dashboard**
1. Open: http://localhost:5173/login/student
2. Login with:
   - **Email**: `admin@university.edu`
   - **Password**: `password123`
3. Navigate to: http://localhost:5173/admin/dashboard

---

## 📋 Admin Credentials

### Default Admin User
- **Name**: System Administrator
- **Email**: admin@university.edu  
- **Password**: password123
- **Role**: admin

### Additional Admin Users (Optional)
- john.admin@university.edu
- sarah.manager@university.edu

---

## 🔗 API Endpoints

### New Admin Dashboard Endpoints
```
GET /api/admin/dashboard     # Comprehensive dashboard data
GET /api/admin/alerts        # Admin alerts and notifications
```

### Existing Admin Endpoints
```
GET /api/admin/analytics     # Basic analytics (legacy)
GET /api/admin/events        # Event management
GET /api/admin/users         # User management
PUT /api/admin/events/:id/status  # Approve/reject events
PUT /api/admin/users/:id/role     # Change user roles
```

---

## 📊 Dashboard Features

### Overview Tab
- **Key Metrics**: Users, clubs, events, registrations
- **User Breakdown**: Students, club leaders, admins
- **Event Status**: Pending, approved, rejected
- **Activity Trends**: 30-day growth metrics
- **Top Clubs**: Most active clubs by event count

### Events Tab
- **Pending Queue**: Events awaiting approval
- **Bulk Actions**: Approve/reject multiple events
- **Filtering**: By status, date, club
- **Event Details**: Registrations, capacity, venue

### Users Tab  
- **User Search**: Find by name or email
- **Role Management**: Change user permissions
- **User Stats**: Registration and club counts
- **Filtering**: By role type

### Monitoring Tab
- **System Health**: Uptime, response times
- **Live Metrics**: Real-time counts
- **Activity Feed**: Recent user actions
- **Quick Actions**: Common admin tasks

---

## 🛠 Troubleshooting

### Admin User Not Working?
```sql
-- Check if admin user exists
SELECT * FROM users WHERE email = 'admin@university.edu';

-- Create admin user manually
INSERT INTO users (name, email, role) 
VALUES ('Admin', 'admin@university.edu', 'admin');
```

### Can't Access Admin Dashboard?
1. Check user role: Must be `admin`
2. Verify authentication token
3. Check browser console for errors
4. Ensure backend is running on port 3000

### API Errors?
```bash
# Test backend connection
curl http://localhost:3000/api/health

# Test admin login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"password123"}'
```

---

## 🔧 Development

### Add New Admin Features
1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/admin.js`
3. Add API method in `frontend/src/services/api.js`
4. Create component in `frontend/src/components/admin/`

### Database Changes
1. Update schema in `database/schema.sql`
2. Run migrations in Supabase dashboard
3. Update controllers to use new fields

---

## 📞 Support

### Common Issues
- **403 Forbidden**: User doesn't have admin role
- **401 Unauthorized**: Invalid or expired token
- **500 Server Error**: Check backend logs
- **CORS Error**: Check API_URL in frontend .env

### Debug Commands
```bash
# Check backend logs
cd backend && npm run dev

# Test admin endpoints
cd backend && npm run test:admin

# Check database connection
cd backend && node test-connection.js
```

---

**Ready to go!** 🎉 Your admin dashboard is now set up and ready for use.