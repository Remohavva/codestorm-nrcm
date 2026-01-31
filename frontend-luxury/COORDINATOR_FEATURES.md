# Coordinator Features

## Overview
Club coordinators/leads now have access to manage events for their specific club only. This provides a role-based access control system where coordinators can create, edit, and delete events but only for their assigned club.

## Login Credentials

### Demo Coordinator Accounts
- **Tech Society Coordinator**: 
  - Email: `alex.chen@university.edu`
  - Password: `password123`
  - Club: Tech Society (ID: 1)

- **Photography Club Coordinator**:
  - Email: `emma.wilson@university.edu` 
  - Password: `password123`
  - Club: Photography Club (ID: 2)

- **Generic Coordinator Demo**:
  - Email: `coordinator@university.edu`
  - Password: `password123`
  - Club: Tech Society (ID: 1)

## Features

### 1. Coordinator Dashboard (`/coordinator`)
- **Club-specific stats**: Total events, upcoming events, registrations, completed events
- **Event management overview**: List of all events for the coordinator's club
- **Quick actions**: Create, edit, view, and delete events
- **Access control**: Only shows events for the coordinator's assigned club

### 2. Create Event (`/coordinator/events/create`)
- **Full event creation form** with all necessary fields:
  - Title, description, type, date, time, location
  - Capacity, prize, tags, requirements, image URL
- **Automatic club assignment**: Events are automatically assigned to the coordinator's club
- **Form validation**: Required fields and proper data types
- **User-friendly interface**: Glass morphism design matching the luxury theme

### 3. Edit Event (`/coordinator/events/[id]/edit`)
- **Pre-populated form**: Loads existing event data for editing
- **Access control**: Only allows editing events from the coordinator's club
- **Same form fields**: All event properties can be updated
- **Validation**: Ensures data integrity during updates

### 4. Event Management Actions
- **View Event**: Navigate to public event detail page
- **Edit Event**: Modify event details
- **Delete Event**: Remove event with confirmation dialog
- **Status indicators**: Visual status badges (open, ongoing, completed)

## Access Control

### Role-Based Navigation
- Coordinator link appears in navbar only for users with `coordinator` role
- Dashboard redirects unauthorized users
- Event management pages check club ownership

### Club Ownership Validation
- Coordinators can only manage events for their assigned club
- Event creation automatically assigns to coordinator's club
- Edit/delete operations validate club ownership
- Access denied for events from other clubs

## Technical Implementation

### Mock Data Structure
```javascript
coordinatorProfiles = {
  'alex.chen@university.edu': {
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    role: 'coordinator',
    clubId: 1,
    clubName: 'Tech Society',
    position: 'President'
  }
}
```

### Authentication Flow
1. User logs in with coordinator credentials
2. Auth service identifies coordinator role and assigns club
3. User object includes `clubId` and `clubName`
4. All coordinator pages validate club ownership

### Event Filtering
- Dashboard filters events by `event.clubId === coordinator.clubId`
- Only shows events belonging to the coordinator's club
- Statistics calculated based on filtered events

## Usage Instructions

1. **Login as Coordinator**:
   - Go to `/login`
   - Use one of the coordinator demo accounts
   - Or click "Coordinator" in the demo login section

2. **Access Coordinator Dashboard**:
   - Click "Coordinator" in the navigation bar
   - Or navigate directly to `/coordinator`

3. **Create New Event**:
   - Click "Create Event" button on dashboard
   - Fill out the event form
   - Submit to create event for your club

4. **Manage Existing Events**:
   - View events list on coordinator dashboard
   - Use action buttons to view, edit, or delete events
   - Only events for your club will be shown

## Security Features

- **Role validation**: Pages check for coordinator role
- **Club ownership**: Events can only be managed by their club's coordinator
- **Access denial**: Unauthorized access redirects with error message
- **Data isolation**: Coordinators cannot see or modify other clubs' events

## Future Enhancements

- **Event approval workflow**: Admin approval for new events
- **Registration management**: View and manage event registrations
- **Analytics dashboard**: Detailed statistics and reports
- **Bulk operations**: Manage multiple events at once
- **Event templates**: Reuse common event configurations
- **Notification system**: Alerts for event updates and registrations