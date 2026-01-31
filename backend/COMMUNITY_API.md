# Community & Discussion API

This document describes the Community & Discussion module APIs for the College Event Platform.

## Overview

The Community module provides a discussion platform where users can:
- Create and share posts
- Comment on posts
- React to posts (like/dislike)
- Report inappropriate content
- Browse posts by category
- Search posts

## Database Tables

The module uses the following Supabase tables:

### posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'hidden', 'deleted'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### comments
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'hidden'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### reactions
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'like', 'dislike'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

### reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL, -- 'post', 'comment'
  content_id UUID NOT NULL,
  reason VARCHAR(50) NOT NULL, -- 'spam', 'harassment', 'inappropriate', 'misinformation', 'other'
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'dismissed'
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Public Endpoints

#### GET /api/community/posts
Get posts feed with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Posts per page
- `category` (string) - Filter by category
- `search` (string) - Search in title and content
- `sort` (string, default: 'created_at') - Sort by field

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Post Title",
        "content": "Post content...",
        "category": "general",
        "author": {
          "id": "uuid",
          "name": "Author Name",
          "role": "student"
        },
        "comment_count": 5,
        "reaction_count": 12,
        "user_reaction": "like", // null if not authenticated or no reaction
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "hasMore": true
    }
  }
}
```

#### GET /api/community/posts/:id
Get single post with comments.

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "uuid",
      "title": "Post Title",
      "content": "Post content...",
      "category": "general",
      "author": {
        "id": "uuid",
        "name": "Author Name",
        "role": "student"
      },
      "comments": [
        {
          "id": "uuid",
          "content": "Comment content...",
          "author": {
            "id": "uuid",
            "name": "Commenter Name",
            "role": "student"
          },
          "created_at": "2024-01-01T00:00:00Z"
        }
      ],
      "comment_count": 5,
      "reaction_count": 12,
      "user_reaction": "like",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Protected Endpoints (Require Authentication)

#### POST /api/community/posts
Create a new post.

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "category": "general" // optional, defaults to 'general'
}
```

**Categories:** `general`, `events`, `clubs`, `academic`, `social`, `announcements`

#### PUT /api/community/posts/:id
Update a post (author or admin only).

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "events"
}
```

#### DELETE /api/community/posts/:id
Delete a post (author or admin only). Performs soft delete by setting status to 'deleted'.

#### POST /api/community/posts/:id/comments
Add a comment to a post.

**Request Body:**
```json
{
  "content": "Comment content..."
}
```

#### POST /api/community/posts/:id/react
React to a post (like/dislike).

**Request Body:**
```json
{
  "type": "like" // or "dislike"
}
```

**Behavior:**
- If user hasn't reacted: adds the reaction
- If user has same reaction: removes the reaction
- If user has different reaction: updates to new reaction type

#### POST /api/community/reports
Report inappropriate content.

**Request Body:**
```json
{
  "type": "post", // or "comment"
  "content_id": "uuid",
  "reason": "spam", // 'spam', 'harassment', 'inappropriate', 'misinformation', 'other'
  "description": "Optional description..." // optional
}
```

### Admin Endpoints (Require Admin Role)

#### GET /api/admin/reports
Get all reports for moderation.

**Query Parameters:**
- `status` (string, default: 'pending') - Filter by status
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Reports per page

#### PUT /api/admin/reports/:id
Handle a report (approve/dismiss).

**Request Body:**
```json
{
  "action": "approved", // or "dismissed"
  "admin_notes": "Optional admin notes..."
}
```

**Behavior:**
- If approved: hides the reported content
- If dismissed: marks report as dismissed

#### GET /api/admin/community/analytics
Get community analytics for admin dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "overview": {
        "total_posts": 150,
        "total_comments": 450,
        "total_reactions": 1200,
        "total_reports": 5
      },
      "recent_activity": {
        "new_posts_30d": 25,
        "new_comments_30d": 80,
        "new_reactions_30d": 200,
        "new_reports_30d": 2
      },
      "moderation": {
        "pending_reports": 3,
        "approved_reports": 1,
        "dismissed_reports": 1,
        "hidden_posts": 2
      },
      "engagement": {
        "likes": 1000,
        "dislikes": 200,
        "avg_comments_per_post": "3.00"
      }
    }
  }
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // for validation errors
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Authentication

Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the `/api/auth/login` endpoint.

## Rate Limiting & Security

- Input validation using Joi schemas
- SQL injection protection via Supabase
- XSS protection via input sanitization
- Role-based access control
- Soft deletes for content moderation

## Testing

Run the community API tests:

```bash
# Run specific test file
npm test -- community.test.js

# Or test manually with the test script
node test-community-api.js
```

Make sure the server is running on `http://localhost:3001` before running tests.