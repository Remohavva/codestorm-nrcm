# College Event Platform - Frontend

React TypeScript frontend for the College Event & Club Management Platform.

## Features

- 🔐 Authentication (Login/Register)
- 📊 Role-based dashboards (Student, Club Lead, Admin)
- 📅 Event browsing and registration
- 🏛️ Club management
- 📝 Registration tracking
- ✅ Attendance management
- 📊 Admin analytics

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context

## Getting Started

### Prerequisites
- Node.js 16+
- Backend API running on port 3001

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3001
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── ProtectedRoute.tsx
│   └── LoadingSpinner.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Events.tsx
├── services/           # API services
│   └── api.ts          # Axios configuration & API calls
└── App.tsx             # Main app component
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## User Roles

### Student
- Browse and register for events
- View registration history
- Check-in to events
- View personal dashboard

### Club Lead
- Create and manage events
- View event registrations
- Manage club information
- Check-in attendees

### Admin
- Approve/reject events
- View analytics dashboard
- Manage users and roles
- System-wide oversight

## API Integration

The frontend communicates with the backend API through:
- Axios interceptors for authentication
- Centralized API service functions
- Error handling and token management
- Automatic logout on 401 responses

## Authentication Flow

1. User logs in with email/password
2. Backend returns user data and access token
3. Token stored in localStorage
4. Token included in all API requests
5. Automatic logout on token expiration

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive sidebar navigation
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements