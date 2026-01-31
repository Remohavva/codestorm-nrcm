# College Event Platform - Backend API

RESTful API for the College Event & Club Management Platform built with Node.js, Express.js, and Supabase.

## Features

- 🔐 Authentication with Supabase Auth
- 👥 Role-based access control (Student, Club Lead, Admin)
- 🏛️ Club management
- 📅 Event creation and approval workflow
- 📝 Event registration system
- ✅ Attendance tracking
- 📊 Admin analytics dashboard
- 🛡️ Input validation and error handling
- 🧪 Comprehensive test coverage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API route definitions
│   ├── utils/           # Utilities and helpers
│   └── app.js          # Express app configuration
├── tests/              # Test files
├── .env               # Environment variables
├── server.js          # Server entry point
└── package.json       # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get single club
- `POST /api/clubs` - Create club (Club Lead/Admin)
- `PUT /api/clubs/:id` - Update club (Club Lead/Admin)

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Club Lead/Admin)
- `PUT /api/events/:id` - Update event (Club Lead/Admin)
- `PUT /api/events/:id/approve` - Approve event (Admin)
- `PUT /api/events/:id/reject` - Reject event (Admin)

### Registrations
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration
- `GET /api/users/me/registrations` - Get user's registrations
- `GET /api/events/:id/registrations` - Get event registrations (Club Lead/Admin)

### Attendance
- `POST /api/events/:id/checkin` - Check in to event
- `GET /api/events/:id/attendance` - Get event attendance (Club Lead/Admin)
- `GET /api/users/me/attendance` - Get user's attendance history

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/events` - Get all events for review
- `GET /api/admin/events/pending` - Get pending events
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### 3. Set up Supabase Database
1. Create a new Supabase project
2. Run the SQL schema from `/database/schema.sql` in your Supabase SQL editor
3. Configure Row Level Security policies (optional for development)

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 5. Test the API
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a club (requires authentication)
```bash
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Tech Club",
    "description": "A club for technology enthusiasts"
  }'
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Security Features

- JWT-based authentication via Supabase Auth
- Role-based access control
- Input validation with Joi
- SQL injection prevention
- CORS protection
- Security headers with Helmet
- Rate limiting (recommended for production)

## Development

### Adding New Endpoints
1. Create controller function in `/src/controllers/`
2. Add validation schema in `/src/utils/validation.js`
3. Create route in `/src/routes/`
4. Add route to `/src/app.js`
5. Write tests in `/tests/`

### Database Changes
1. Update schema in `/database/schema.sql`
2. Run migration in Supabase
3. Update controllers and validation as needed

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production Supabase project
3. Set up proper CORS origins
4. Enable rate limiting
5. Set up monitoring and logging
6. Configure SSL/TLS

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Validate all inputs
4. Handle errors properly
5. Update documentation