# College Events Mobile App

A React Native mobile application built with Expo for the College Event Platform, featuring a Community & Discussion module with a silver + chrome + black theme.

## 🚀 Features

### ✅ Implemented
- **Authentication System**
  - User login and registration
  - Secure token-based authentication
  - Auto-login with stored credentials

- **Community & Discussion Module**
  - Browse posts feed with pagination
  - Create new posts with categories
  - Comment on posts
  - Like/react to posts
  - Search and filter posts
  - Report inappropriate content
  - Real-time updates

- **Navigation**
  - Bottom tab navigation
  - Stack navigation for detailed views
  - Smooth transitions

- **UI/UX**
  - Silver + Chrome + Black theme
  - Gradient backgrounds
  - Chrome-themed cards
  - Consistent design system
  - Responsive layout

### 🔄 Coming Soon
- Events management
- Club exploration
- User profile management
- Push notifications
- Offline support

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Expo Vector Icons
- **Styling**: StyleSheet with theme system

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

### 1. Install Dependencies
```bash
cd college-event-mobile
npm install
```

### 2. Configure API Endpoint
Update the API base URL in `src/constants/api.js`:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:3001/api'  // Replace with your local IP
  : 'https://your-production-api.com/api';
```

**Important**: Use your computer's local IP address (not localhost) so the mobile app can connect to your backend server.

### 3. Start the Development Server
```bash
npm start
```

### 4. Run on Device
1. Install Expo Go app on your phone
2. Scan the QR code from the terminal/browser
3. The app will load on your device

## 📂 Project Structure

```
college-event-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Input.js
│   ├── constants/           # App constants
│   │   ├── theme.js         # Theme colors and styles
│   │   └── api.js           # API endpoints
│   ├── contexts/            # React contexts
│   │   └── AuthContext.js   # Authentication state
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── CommunityScreen.js
│   │   ├── PostDetailScreen.js
│   │   ├── CreatePostScreen.js
│   │   └── ...
│   ├── services/            # API services
│   │   └── api.js
│   └── utils/               # Utility functions
├── assets/                  # Static assets
├── App.js                   # Main app component
└── package.json
```

## 🎨 Theme System

The app uses a consistent silver + chrome + black theme:

### Colors
- **Primary**: Silver (#C0C0C0)
- **Chrome**: Metallic gradients
- **Black**: Various black shades
- **Accent**: Blue (#4A90E2) for actions

### Components
- **Cards**: Chrome gradient backgrounds with shadows
- **Buttons**: Gradient primary buttons with chrome effect
- **Inputs**: Clean design with focus states
- **Navigation**: Silver theme with black text

## 📱 Screens Overview

### Authentication
- **Login Screen**: Email/password login with validation
- **Register Screen**: User registration form

### Main App
- **Home**: Dashboard with quick actions
- **Community**: Posts feed with search and filters
- **Post Detail**: Full post view with comments
- **Create Post**: New post creation with categories
- **Events**: Event listing (placeholder)
- **Clubs**: Club exploration (placeholder)
- **Profile**: User profile and settings

## 🔧 API Integration

The app connects to the backend API for:

### Community Features
- `GET /community/posts` - Fetch posts feed
- `POST /community/posts` - Create new post
- `GET /community/posts/:id` - Get post details
- `POST /community/posts/:id/comments` - Add comment
- `POST /community/posts/:id/react` - React to post
- `POST /community/reports` - Report content

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

## 🚀 Running with Expo Go

### On Physical Device
1. Install Expo Go from App Store/Play Store
2. Start the development server: `npm start`
3. Scan QR code with Expo Go (Android) or Camera app (iOS)

### Development Tips
- Use your computer's local IP address for API calls
- Enable "Tunnel" mode in Expo CLI if having connection issues
- Shake device to open developer menu
- Use `console.log()` for debugging (visible in terminal)

## 🔄 State Management

### Authentication State
- Managed by `AuthContext`
- Persisted in AsyncStorage
- Auto-restore on app launch

### API State
- Local component state for UI data
- Loading states for better UX
- Error handling with user feedback

## 🎯 Key Features Implemented

### Community Module
- **Post Feed**: Infinite scroll with pagination
- **Categories**: Filter posts by category
- **Search**: Real-time search functionality
- **Reactions**: Like/unlike posts
- **Comments**: Add and view comments
- **Create Posts**: Rich post creation form
- **Reporting**: Report inappropriate content

### User Experience
- **Smooth Navigation**: Tab and stack navigation
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Offline Handling**: Graceful degradation
- **Responsive Design**: Works on various screen sizes

## 🔧 Customization

### Theme Customization
Edit `src/constants/theme.js` to modify:
- Colors
- Font sizes
- Spacing
- Border radius
- Shadows

### API Configuration
Update `src/constants/api.js` for:
- Base URL
- Endpoints
- HTTP status codes

## 📝 Development Notes

### Backend Connection
- Ensure backend server is running on `http://localhost:3001`
- Use local IP address in API configuration
- Test API endpoints before mobile testing

### Expo Go Limitations
- Some native modules may not work in Expo Go
- Use EAS Build for production apps
- Development builds recommended for advanced features

## 🚀 Next Steps

1. **Complete Events Module**: Event listing, details, registration
2. **Clubs Module**: Club exploration and membership
3. **Push Notifications**: Real-time updates
4. **Offline Support**: Cache data for offline use
5. **Performance**: Optimize images and API calls
6. **Testing**: Add unit and integration tests

## 📱 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Browse community posts
- [ ] Create new posts
- [ ] Add comments
- [ ] React to posts
- [ ] Search and filter
- [ ] Navigation between screens
- [ ] Error handling

### Device Testing
- Test on both iOS and Android
- Various screen sizes
- Different network conditions
- Background/foreground transitions

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established theme system
3. Add proper error handling
4. Test on multiple devices
5. Update documentation

## 📄 License

This project is part of the College Event Platform system.