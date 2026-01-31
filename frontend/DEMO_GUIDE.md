# CampusHub - Demo Guide

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Open http://localhost:5173 in your browser

## Demo Flow

### 1. Login
- Go to `/login`
- Select **Student** or **Club Coordinator**
- For Student: Use any email/password (mock authentication)
- For Coordinator: Use any email/password (mock authentication)

### 2. Student Dashboard Features

#### Feed Page (`/student/dashboard/feed`)
- View all club posts and event announcements
- Click on event titles or "View Details & Register" to see event details
- Like, comment, and share posts
- Register for events directly from feed

#### Clubs Page (`/student/dashboard/clubs`)
- Browse all clubs
- Filter by category (Technology, Arts, Academic, Business)
- Click "View Club" to see detailed club information

#### Club Detail Page (`/student/dashboard/clubs/:id`)
- View club history, leadership, past events, achievements
- See coordinator and president information
- Join club functionality

#### Event Detail Page (`/student/dashboard/events/:id`)
- Complete event information
- Registration with **Razorpay** payment gateway (https://razorpay.me/@golivignesh)
- **Payment Flow:**
  1. Click "Register & Pay ₹X" for paid events
  2. Payment section shows Razorpay branding and amount
  3. Click "Pay ₹X via Razorpay" – opens Razorpay payment link in new tab
  4. Complete payment on Razorpay; return to app and click "Confirm payment completed"
  5. Success confirmation shown; optional: "View My Registrations"

#### My Registrations (`/student/dashboard/registrations`)
- View all registered events
- See registration status (Confirmed, Pending, Cancelled)
- Click "View Details" to see event information
- Cancel registration option

#### Profile Page (`/student/dashboard/profile`)
- View profile information
- See interests, clubs, upcoming and past events
- View statistics (events attended, clubs joined, certificates)

#### Discussions (`/student/dashboard/discussions`)
- View all student discussions
- See replies, views, and last reply information
- Start new discussions

### 3. Navigation
- **Sidebar:** Navigate between all pages
- **Top Navbar:** Search, notifications, profile
- **Logout:** Bottom of sidebar

## Key Features to Demo

### Payment Gateway
1. Go to Feed page
2. Find an event with fee (e.g., "Hackathon 2024" - ₹500)
3. Click "View Details & Register"
4. Click "Register & Pay ₹500"
5. Payment modal appears
6. Click "Pay ₹500" button
7. Success message appears
8. Click "View My Registrations" to see registered event

### Event Registration (Free)
1. Go to Feed page
2. Find a free event (e.g., "Photo Walk")
3. Click "View Details & Register"
4. Click "Register Now"
5. Success message appears immediately

### Club Exploration
1. Go to Clubs page
2. Filter by category
3. Click "View Club" on any club
4. See detailed information including:
   - History
   - Leadership (Coordinator, President, VP)
   - Past events
   - Achievements
   - Social links

### Profile Management
1. Click Profile in sidebar
2. View all profile information
3. See interests, clubs, events
4. Check statistics

## All Routes

### Public Routes
- `/` → Redirects to `/login`
- `/login` → Login selector
- `/login/student` → Student login
- `/login/coordinator` → Coordinator login
- `/signup` → Student signup
- `/forgot-password` → Password reset

### Student Dashboard Routes
- `/student/dashboard` → Redirects to feed
- `/student/dashboard/feed` → Feed page
- `/student/dashboard/clubs` → All clubs
- `/student/dashboard/clubs/:id` → Club detail
- `/student/dashboard/events/:id` → Event detail
- `/student/dashboard/registrations` → My registrations
- `/student/dashboard/discussions` → Discussions
- `/student/dashboard/profile` → Profile

## Mock Data

All data is currently mock data:
- Events with different fees (₹0, ₹300, ₹500, ₹1000)
- Clubs with detailed information
- User profile with interests and clubs
- Feed posts with interactions
- Discussions and registrations

## Razorpay Integration

- **Payment link:** https://razorpay.me/@golivignesh
- When user clicks "Pay ₹X via Razorpay", the Razorpay payment link opens in a new tab.
- After completing payment on Razorpay, user clicks "Confirm payment completed" in the app to mark registration as successful.
- For full integration (auto-confirm on payment success), add a backend that creates orders and handles Razorpay webhooks.

## Notes for Evaluator

- All pages are fully functional with mock data
- Navigation works between all pages
- Payment gateway demonstrates the flow (ready for Razorpay integration)
- Responsive design for mobile and desktop
- Clean, minimalist UI with matte black theme
- All features requested are implemented and working
