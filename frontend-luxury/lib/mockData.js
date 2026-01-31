// Enhanced Mock Data for Luxury Frontend

export const clubs = [
  {
    id: 1,
    name: 'Tech Society',
    description: 'A community for tech enthusiasts to learn, build, and innovate together.',
    category: 'Technology',
    members: 245,
    events: 12,
    logo: '🔧',
    coverImage: '',
    tags: ['Programming', 'AI', 'Web Development'],
    upcomingEvent: 'Hackathon 2024',
    socialLinks: {
      website: 'techsociety.edu',
      instagram: '@techsociety'
    },
    member_count: 245,
    event_count: 12
  },
  {
    id: 2,
    name: 'Photography Club',
    description: 'Capture moments, share stories, and explore the art of photography.',
    category: 'Arts',
    members: 189,
    events: 8,
    logo: '📷',
    coverImage: '',
    tags: ['Photography', 'Videography', 'Editing'],
    upcomingEvent: 'Photo Walk',
    socialLinks: {
      website: 'photoclub.edu',
      instagram: '@photoclub'
    },
    member_count: 189,
    event_count: 8
  },
  {
    id: 3,
    name: 'Debate Society',
    description: 'Sharpen your arguments and engage in intellectual discourse.',
    category: 'Academic',
    members: 156,
    events: 15,
    logo: '💬',
    coverImage: '',
    tags: ['Debate', 'Public Speaking', 'Politics'],
    upcomingEvent: 'Inter-College Debate',
    socialLinks: {
      website: 'debatesociety.edu',
      instagram: '@debatesociety'
    },
    member_count: 156,
    event_count: 15
  },
  {
    id: 4,
    name: 'Music Club',
    description: 'For musicians, singers, and music lovers to collaborate and perform.',
    category: 'Arts',
    members: 312,
    events: 20,
    logo: '🎵',
    coverImage: '',
    tags: ['Music', 'Performance', 'Collaboration'],
    upcomingEvent: 'Open Mic Night',
    socialLinks: {
      website: 'musicclub.edu',
      instagram: '@musicclub'
    },
    member_count: 312,
    event_count: 20
  },
  {
    id: 5,
    name: 'Entrepreneurship Cell',
    description: 'Foster innovation and entrepreneurship among students.',
    category: 'Business',
    members: 278,
    events: 10,
    logo: '💼',
    coverImage: '',
    tags: ['Startups', 'Business', 'Innovation'],
    upcomingEvent: 'Startup Pitch Day',
    socialLinks: {
      website: 'e-cell.edu',
      instagram: '@ecell'
    },
    member_count: 278,
    event_count: 10
  }
];

export const events = [
  {
    id: 1,
    title: 'Hackathon 2024',
    club: 'Tech Society',
    clubId: 1,
    date: '2026-03-15T09:00:00Z',
    time: '09:00',
    location: 'Main Auditorium',
    venue: 'Main Auditorium',
    type: 'Competition',
    description: '24-hour coding competition with exciting prizes. Build innovative solutions to real-world problems.',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
    registered: 45,
    capacity: 100,
    max_participants: 100,
    registered_count: 45,
    status: 'upcoming',
    tags: ['Programming', 'Competition', 'Tech'],
    deadline: '2026-03-10',
    prize: '₹50,000',
    requirements: ['Laptop', 'Team of 2-4 members'],
    organizer: 'Tech Society',
    contact_email: 'tech@university.edu'
  },
  {
    id: 2,
    title: 'Photo Walk',
    club: 'Photography Club',
    clubId: 2,
    date: '2026-02-15T06:00:00Z',
    time: '06:00',
    location: 'Campus Grounds',
    venue: 'Campus Grounds',
    type: 'Workshop',
    description: 'Early morning photo walk around campus. Learn composition and lighting techniques.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    registered: 28,
    capacity: 30,
    max_participants: 30,
    registered_count: 28,
    status: 'upcoming',
    tags: ['Photography', 'Outdoor', 'Learning'],
    deadline: '2026-02-14',
    prize: null,
    requirements: ['Camera or Smartphone'],
    organizer: 'Photography Club',
    contact_email: 'photo@university.edu'
  },
  {
    id: 3,
    title: 'Inter-College Debate',
    club: 'Debate Society',
    clubId: 3,
    date: '2026-02-20T14:00:00Z',
    time: '14:00',
    location: 'Conference Hall',
    venue: 'Conference Hall',
    type: 'Competition',
    description: 'Annual inter-college debate competition. Topics range from current affairs to philosophy.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    registered: 12,
    capacity: 50,
    max_participants: 50,
    registered_count: 12,
    status: 'upcoming',
    tags: ['Debate', 'Competition', 'Academic'],
    deadline: '2026-02-18',
    prize: '₹25,000',
    requirements: ['Registration', 'Team of 2'],
    organizer: 'Debate Society',
    contact_email: 'debate@university.edu'
  },
  {
    id: 4,
    title: 'Open Mic Night',
    club: 'Music Club',
    clubId: 4,
    date: '2026-02-12T18:00:00Z',
    time: '18:00',
    location: 'Amphitheater',
    venue: 'Amphitheater',
    type: 'Performance',
    description: 'Showcase your musical talent. All genres welcome. Sign up for a 5-minute slot.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    registered: 35,
    capacity: 200,
    max_participants: 200,
    registered_count: 35,
    status: 'upcoming',
    tags: ['Music', 'Performance', 'Entertainment'],
    deadline: '2026-02-11',
    prize: null,
    requirements: ['Instrument (if needed)'],
    organizer: 'Music Club',
    contact_email: 'music@university.edu'
  },
  {
    id: 5,
    title: 'Startup Pitch Day',
    club: 'Entrepreneurship Cell',
    clubId: 5,
    date: '2026-02-25T10:00:00Z',
    time: '10:00',
    location: 'Business School',
    venue: 'Business School',
    type: 'Competition',
    description: 'Pitch your startup idea to investors and mentors. Get feedback and potential funding.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    registered: 18,
    capacity: 30,
    max_participants: 30,
    registered_count: 18,
    status: 'upcoming',
    tags: ['Business', 'Startups', 'Pitching'],
    deadline: '2026-02-23',
    prize: '₹1,00,000',
    requirements: ['Business Plan', 'Pitch Deck'],
    organizer: 'Entrepreneurship Cell',
    contact_email: 'ecell@university.edu'
  },
  {
    id: 6,
    title: 'AI Workshop - Ongoing',
    club: 'Tech Society',
    clubId: 1,
    date: new Date().toISOString(),
    time: '14:00',
    location: 'Computer Lab',
    venue: 'Computer Lab',
    type: 'Workshop',
    description: 'Hands-on AI workshop covering machine learning basics and practical applications. Currently in progress!',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    registered: 35,
    capacity: 40,
    max_participants: 40,
    registered_count: 35,
    status: 'ongoing',
    tags: ['AI', 'Workshop', 'Learning'],
    deadline: new Date().toISOString().split('T')[0],
    prize: null,
    requirements: ['Laptop'],
    organizer: 'Tech Society',
    contact_email: 'tech@university.edu'
  },
  {
    id: 7,
    title: 'Photography Exhibition',
    club: 'Photography Club',
    clubId: 2,
    date: '2024-02-20T10:00:00Z',
    time: '10:00',
    location: 'Art Gallery',
    venue: 'Art Gallery',
    type: 'Exhibition',
    description: 'Student photography exhibition showcasing amazing work from our members.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
    registered: 25,
    capacity: 50,
    max_participants: 50,
    registered_count: 25,
    status: 'completed',
    tags: ['Photography', 'Exhibition', 'Arts'],
    deadline: '2024-02-18',
    prize: null,
    requirements: [],
    organizer: 'Photography Club',
    contact_email: 'photo@university.edu'
  }
];

export const feedPosts = [
  {
    id: 1,
    type: 'event',
    club: 'Tech Society',
    clubId: 1,
    author: 'Tech Society',
    authorAvatar: '🔧',
    timestamp: '2 hours ago',
    content: {
      title: 'Hackathon 2024 Registration Open!',
      description: 'Join us for an exciting 24-hour coding competition. Build innovative solutions and win amazing prizes!',
      eventId: 1
    },
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
    likes: 45,
    comments: 12,
    shares: 8,
    isLiked: false,
    isRegistered: false
  },
  {
    id: 2,
    type: 'announcement',
    club: 'Photography Club',
    clubId: 2,
    author: 'Photography Club',
    authorAvatar: '📷',
    timestamp: '5 hours ago',
    content: {
      title: 'Photo Walk This Weekend',
      description: 'Early morning photo walk around campus. Perfect for golden hour shots! Bring your cameras.',
      eventId: 2
    },
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    likes: 32,
    comments: 7,
    shares: 5,
    isLiked: true,
    isRegistered: true
  },
  {
    id: 3,
    type: 'post',
    club: 'Debate Society',
    clubId: 3,
    author: 'Sarah Johnson',
    authorAvatar: '💬',
    timestamp: '1 day ago',
    content: {
      title: 'Great session today!',
      description: 'Had an amazing debate session today. The topic was "AI and Ethics" - really thought-provoking discussions!'
    },
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    likes: 28,
    comments: 5,
    shares: 3,
    isLiked: false,
    isRegistered: false
  },
  {
    id: 4,
    type: 'event',
    club: 'Music Club',
    clubId: 4,
    author: 'Music Club',
    authorAvatar: '🎵',
    timestamp: '2 days ago',
    content: {
      title: 'Open Mic Night - Sign Up Now!',
      description: 'Showcase your talent! 5-minute slots available. All genres welcome.',
      eventId: 4
    },
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    likes: 67,
    comments: 15,
    shares: 22,
    isLiked: true,
    isRegistered: false
  }
];

export const myRegistrations = [
  {
    eventId: 2,
    registeredAt: '2024-03-01',
    status: 'confirmed',
    event: events.find(e => e.id === 2) || events[1]
  },
  {
    eventId: 4,
    registeredAt: '2024-03-02',
    status: 'confirmed',
    event: events.find(e => e.id === 4) || events[3]
  },
  {
    eventId: 6,
    registeredAt: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    event: events.find(e => e.id === 6) || events[5]
  }
];

export const clubDetails = {
  1: {
    ...clubs[0],
    history: 'Founded in 2018, Tech Society has been at the forefront of technological innovation on campus. We started with just 20 members and have grown to become one of the largest and most active clubs.',
    coordinator: {
      name: 'Dr. Sarah Williams',
      email: 'sarah.williams@university.edu',
      role: 'Faculty Coordinator'
    },
    president: {
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      role: 'President',
      year: '4th Year'
    },
    achievements: [
      'Won Best Tech Club Award 2023',
      'Organized largest campus hackathon with 200+ participants',
      'Published 15+ research papers by members'
    ]
  },
  2: {
    ...clubs[1],
    history: 'Photography Club was established in 2019 to bring together photography enthusiasts. We organize regular photo walks, workshops, and exhibitions.',
    coordinator: {
      name: 'Prof. Michael Brown',
      email: 'michael.brown@university.edu',
      role: 'Faculty Coordinator'
    },
    president: {
      name: 'Emma Wilson',
      email: 'emma.wilson@university.edu',
      role: 'President',
      year: '3rd Year'
    },
    achievements: [
      'Annual photography exhibition with 100+ submissions',
      'Collaborated with local galleries for student showcases'
    ]
  }
};

export const eventGallery = {
  1: [
    { id: 1, eventId: 6, title: 'Web Development Workshop', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', date: '2024-02-15' },
    { id: 2, eventId: 7, title: 'AI/ML Bootcamp', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop', date: '2024-01-10' }
  ],
  2: [
    { id: 1, eventId: 12, title: 'Photo Walk', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop', date: '2024-02-05' },
    { id: 2, eventId: 13, title: 'Portrait Workshop', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', date: '2024-01-15' }
  ]
};

export const userProfile = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  year: '3rd Year',
  course: 'Computer Science',
  studentId: 'CS2021001',
  student_id: 'CS2021001',
  department: 'computer-science',
  interests: ['Programming', 'AI/ML', 'Web Development', 'Photography', 'Music'],
  clubs: [
    { id: 1, name: 'Tech Society', role: 'Member' },
    { id: 2, name: 'Photography Club', role: 'Member' }
  ],
  avatar: 'JD',
  bio: 'Passionate about technology and creative arts. Always learning something new!',
  joinDate: '2022-09-01',
  totalEvents: 12,
  certificates: 3,
  role: 'student'
};

// Coordinator profiles
export const coordinatorProfiles = {
  'alex.chen@university.edu': {
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    role: 'coordinator',
    clubId: 1,
    clubName: 'Tech Society',
    position: 'President',
    year: '4th Year',
    department: 'Computer Science',
    avatar: 'AC',
    bio: 'Leading Tech Society to new heights. Passionate about innovation and technology.',
    joinDate: '2021-09-01'
  },
  'emma.wilson@university.edu': {
    name: 'Emma Wilson',
    email: 'emma.wilson@university.edu',
    role: 'coordinator',
    clubId: 2,
    clubName: 'Photography Club',
    position: 'President',
    year: '3rd Year',
    department: 'Fine Arts',
    avatar: 'EW',
    bio: 'Capturing moments and leading the photography community on campus.',
    joinDate: '2022-09-01'
  }
};

export const mockStats = {
  student: {
    registeredEvents: 5,
    attendedEvents: 8,
    clubMemberships: 2,
    totalEvents: 12
  },
  coordinator: {
    totalEvents: 15,
    totalRegistrations: 245,
    activeClubs: 3,
    pendingApprovals: 2
  },
  admin: {
    totalUsers: 1250,
    totalEvents: 45,
    totalClubs: 12,
    pendingEvents: 5
  }
};

// Mock API responses
export const mockApiResponses = {
  '/api/events': {
    success: true,
    data: { events }
  },
  '/api/clubs': {
    success: true,
    data: { clubs }
  },
  '/api/users/me/registrations': {
    success: true,
    data: {
      registrations: [
        { event_id: '2', eventId: 2 },
        { event_id: '4', eventId: 4 },
        { event_id: '6', eventId: 6 }
      ]
    }
  },
  '/api/coordinator/stats': {
    success: true,
    data: mockStats.coordinator
  },
  '/api/admin/stats': {
    success: true,
    data: mockStats.admin
  }
};

export default {
  clubs,
  events,
  feedPosts,
  userProfile,
  coordinatorProfiles,
  mockStats,
  mockApiResponses,
  myRegistrations,
  clubDetails,
  eventGallery
};