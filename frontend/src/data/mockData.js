// Mock data for Student Dashboard

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
    }
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
    }
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
    }
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
    }
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
    }
  }
];

export const events = [
  {
    id: 1,
    title: 'Hackathon 2024',
    club: 'Tech Society',
    clubId: 1,
    date: '2026-03-15',
    time: '09:00',
    location: 'Main Auditorium',
    type: 'Competition',
    description: '24-hour coding competition with exciting prizes. Build innovative solutions to real-world problems.',
    image: '',
    registered: 45,
    capacity: 100,
    status: 'open',
    tags: ['Programming', 'Competition', 'Tech'],
    deadline: '2026-03-10',
    prize: '₹50,000',
    requirements: ['Laptop', 'Team of 2-4 members']
  },
  {
    id: 6,
    title: 'AI Workshop - Ongoing',
    club: 'Tech Society',
    clubId: 1,
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    location: 'Computer Lab',
    type: 'Workshop',
    description: 'Hands-on AI workshop covering machine learning basics and practical applications. Currently in progress!',
    image: '',
    registered: 35,
    capacity: 40,
    status: 'ongoing',
    tags: ['AI', 'Workshop', 'Learning'],
    deadline: new Date().toISOString().split('T')[0],
    prize: null,
    requirements: ['Laptop']
  },
  {
    id: 7,
    title: 'Photography Exhibition',
    club: 'Photography Club',
    clubId: 2,
    date: '2024-02-20', // Past event
    time: '10:00',
    location: 'Art Gallery',
    type: 'Exhibition',
    description: 'Student photography exhibition showcasing amazing work from our members.',
    image: '',
    registered: 25,
    capacity: 50,
    status: 'completed',
    tags: ['Photography', 'Exhibition', 'Arts'],
    deadline: '2024-02-18',
    prize: null,
    requirements: []
  },
  {
    id: 2,
    title: 'Photo Walk',
    club: 'Photography Club',
    clubId: 2,
    date: '2026-02-15',
    time: '06:00',
    location: 'Campus Grounds',
    type: 'Workshop',
    description: 'Early morning photo walk around campus. Learn composition and lighting techniques.',
    image: '',
    registered: 28,
    capacity: 30,
    status: 'open',
    tags: ['Photography', 'Outdoor', 'Learning'],
    deadline: '2026-02-14',
    prize: null,
    requirements: ['Camera or Smartphone']
  },
  {
    id: 3,
    title: 'Inter-College Debate',
    club: 'Debate Society',
    clubId: 3,
    date: '2026-02-20',
    time: '14:00',
    location: 'Conference Hall',
    type: 'Competition',
    description: 'Annual inter-college debate competition. Topics range from current affairs to philosophy.',
    image: '',
    registered: 12,
    capacity: 50,
    status: 'open',
    tags: ['Debate', 'Competition', 'Academic'],
    deadline: '2026-02-18',
    prize: '₹25,000',
    requirements: ['Registration', 'Team of 2']
  },
  {
    id: 4,
    title: 'Open Mic Night',
    club: 'Music Club',
    clubId: 4,
    date: '2026-02-12',
    time: '18:00',
    location: 'Amphitheater',
    type: 'Performance',
    description: 'Showcase your musical talent. All genres welcome. Sign up for a 5-minute slot.',
    image: '',
    registered: 35,
    capacity: 200,
    status: 'open',
    tags: ['Music', 'Performance', 'Entertainment'],
    deadline: '2026-02-11',
    prize: null,
    requirements: ['Instrument (if needed)']
  },
  {
    id: 5,
    title: 'Startup Pitch Day',
    club: 'Entrepreneurship Cell',
    clubId: 5,
    date: '2026-02-25',
    time: '10:00',
    location: 'Business School',
    type: 'Competition',
    description: 'Pitch your startup idea to investors and mentors. Get feedback and potential funding.',
    image: '',
    registered: 18,
    capacity: 30,
    status: 'open',
    tags: ['Business', 'Startups', 'Pitching'],
    deadline: '2026-02-23',
    prize: '₹1,00,000',
    requirements: ['Business Plan', 'Pitch Deck']
  },
  {
    id: 8,
    title: 'Web Development Bootcamp',
    club: 'Tech Society',
    clubId: 1,
    date: '2026-02-22',
    time: '10:00',
    location: 'Computer Lab 2',
    type: 'Workshop',
    description: 'Learn full-stack web development in this intensive 2-day bootcamp. Build a real project!',
    image: '',
    registered: 42,
    capacity: 50,
    status: 'open',
    tags: ['Web Development', 'Workshop', 'Learning'],
    deadline: '2026-02-20',
    prize: null,
    requirements: ['Laptop']
  },
  {
    id: 9,
    title: 'Music Festival 2024',
    club: 'Music Club',
    clubId: 4,
    date: '2026-02-18',
    time: '17:00',
    location: 'Amphitheater',
    type: 'Performance',
    description: 'Annual music festival featuring performances from all music club members. Food and drinks available!',
    image: '',
    registered: 156,
    capacity: 300,
    status: 'open',
    tags: ['Music', 'Festival', 'Entertainment'],
    deadline: '2026-02-17',
    prize: null,
    requirements: []
  },
  {
    id: 10,
    title: 'Data Science Workshop',
    club: 'Tech Society',
    clubId: 1,
    date: '2026-02-28',
    time: '14:00',
    location: 'Data Science Lab',
    type: 'Workshop',
    description: 'Introduction to data science with Python. Learn pandas, numpy, and visualization.',
    image: '',
    registered: 38,
    capacity: 45,
    status: 'open',
    tags: ['Data Science', 'Python', 'Workshop'],
    deadline: '2026-02-26',
    prize: null,
    requirements: ['Laptop with Python installed']
  },
  {
    id: 11,
    title: 'Photography Contest',
    club: 'Photography Club',
    clubId: 2,
    date: '2026-03-05',
    time: '11:00',
    location: 'Art Gallery',
    type: 'Competition',
    description: 'Submit your best photographs. Winners get featured in the annual photography magazine.',
    image: '',
    registered: 67,
    capacity: 100,
    status: 'open',
    tags: ['Photography', 'Competition', 'Arts'],
    deadline: '2026-03-03',
    prize: '₹15,000',
    requirements: ['3-5 photographs']
  },
  {
    id: 12,
    title: 'Demo Test Event - Register & Cancel',
    club: 'Tech Society',
    clubId: 1,
    date: '2026-02-10',
    time: '15:00',
    location: 'Main Auditorium',
    type: 'Workshop',
    description: 'This is a demo event for testing registration and cancellation features. Register, test payment, and then cancel to see the full flow.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    registered: 15,
    capacity: 50,
    status: 'open',
    tags: ['Demo', 'Testing', 'Workshop'],
    deadline: '2026-02-08',
    prize: null,
    requirements: ['Laptop']
  }
];

export const pastEventsList = [
  {
    id: 12,
    title: 'Web Development Workshop',
    club: 'Tech Society',
    clubId: 1,
    date: '2024-02-15',
    time: '10:00',
    location: 'Computer Lab',
    type: 'Workshop',
    description: 'Comprehensive workshop covering HTML, CSS, JavaScript, and React. Hands-on projects included.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    registered: 45,
    capacity: 50,
    status: 'completed',
    tags: ['Web Development', 'Workshop'],
    prize: null,
    requirements: ['Laptop']
  },
  {
    id: 13,
    title: 'Photography Basics',
    club: 'Photography Club',
    clubId: 2,
    date: '2024-02-10',
    time: '14:00',
    location: 'Art Studio',
    type: 'Workshop',
    description: 'Learn the fundamentals of photography including composition, lighting, and camera settings.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop',
    registered: 30,
    capacity: 30,
    status: 'completed',
    tags: ['Photography', 'Workshop'],
    prize: null,
    requirements: ['Camera or Smartphone']
  },
  {
    id: 14,
    title: 'Coding Competition',
    club: 'Tech Society',
    clubId: 1,
    date: '2024-01-20',
    time: '09:00',
    location: 'Main Auditorium',
    type: 'Competition',
    description: 'Competitive programming contest with algorithmic challenges. Winners received certificates and prizes.',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
    registered: 120,
    capacity: 150,
    status: 'completed',
    tags: ['Programming', 'Competition'],
    prize: '₹30,000',
    requirements: ['Laptop']
  },
  {
    id: 15,
    title: 'Debate Championship',
    club: 'Debate Society',
    clubId: 3,
    date: '2024-01-25',
    time: '15:00',
    location: 'Conference Hall',
    type: 'Competition',
    description: 'Annual debate championship with teams from multiple colleges. Topics covered current affairs and ethics.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    registered: 40,
    capacity: 50,
    status: 'completed',
    tags: ['Debate', 'Competition'],
    prize: '₹20,000',
    requirements: ['Team of 2']
  },
  {
    id: 16,
    title: 'Music Festival 2023',
    club: 'Music Club',
    clubId: 4,
    date: '2023-11-20',
    time: '18:00',
    location: 'Amphitheater',
    type: 'Performance',
    description: 'Annual music festival with performances from all genres. Featured guest artists and student bands.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    registered: 280,
    capacity: 300,
    status: 'completed',
    tags: ['Music', 'Festival'],
    prize: null,
    requirements: []
  }
];

export const feedPosts = [
  {
    id: 1,
    type: 'event',
    club: 'Tech Society',
    clubId: 1,
    author: 'Tech Society',
    authorAvatar: '',
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
    id: 7,
    type: 'event',
    club: 'Tech Society',
    clubId: 1,
    author: 'Tech Society',
    authorAvatar: '',
    timestamp: 'Just now',
    content: {
      title: 'Demo Test Event - Register & Cancel',
      description: 'This is a demo event for testing registration and cancellation features. Perfect for testing the full flow!',
      eventId: 12
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    likes: 5,
    comments: 2,
    shares: 1,
    isLiked: false,
    isRegistered: false
  },
  {
    id: 2,
    type: 'announcement',
    club: 'Photography Club',
    clubId: 2,
    author: 'Photography Club',
    authorAvatar: '',
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
    authorAvatar: '',
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
    authorAvatar: '',
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
  },
  {
    id: 5,
    type: 'announcement',
    club: 'Entrepreneurship Cell',
    clubId: 5,
    author: 'Entrepreneurship Cell',
    authorAvatar: '',
    timestamp: '3 days ago',
    content: {
      title: 'Startup Pitch Day - Applications Open',
      description: 'Pitch your startup idea to real investors. Get feedback, mentorship, and potential funding!',
      eventId: 5
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    likes: 89,
    comments: 23,
    shares: 18,
    isLiked: false,
    isRegistered: false
  },
  {
    id: 6,
    type: 'event',
    club: 'Tech Society',
    clubId: 1,
    author: 'Tech Society',
    authorAvatar: '',
    timestamp: 'Just now',
    content: {
      title: 'AI Workshop - Currently Happening!',
      description: 'Our AI workshop is in full swing! Join us at the Computer Lab for hands-on learning.',
      eventId: 6
    },
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    likes: 52,
    comments: 8,
    shares: 12,
    isLiked: false,
    isRegistered: true
  }
];

export const discussions = [
  {
    id: 1,
    title: 'Best programming language for beginners?',
    author: 'Alex Chen',
    authorAvatar: '',
    club: 'Tech Society',
    timestamp: '3 hours ago',
    replies: 15,
    views: 234,
    tags: ['Programming', 'Beginner'],
    lastReply: {
      author: 'Maria Garcia',
      timestamp: '1 hour ago'
    }
  },
  {
    id: 2,
    title: 'Camera recommendations for campus photography?',
    author: 'David Kim',
    authorAvatar: '',
    club: 'Photography Club',
    timestamp: '5 hours ago',
    replies: 8,
    views: 156,
    tags: ['Photography', 'Equipment'],
    lastReply: {
      author: 'Emma Wilson',
      timestamp: '2 hours ago'
    }
  },
  {
    id: 3,
    title: 'Debate topic suggestions for next session?',
    author: 'James Taylor',
    authorAvatar: '',
    club: 'Debate Society',
    timestamp: '1 day ago',
    replies: 22,
    views: 189,
    tags: ['Debate', 'Discussion'],
    lastReply: {
      author: 'Sophie Brown',
      timestamp: '4 hours ago'
    }
  },
  {
    id: 4,
    title: 'Looking for band members for Open Mic',
    author: 'Ryan Patel',
    authorAvatar: '',
    club: 'Music Club',
    timestamp: '2 days ago',
    replies: 12,
    views: 145,
    tags: ['Music', 'Collaboration'],
    lastReply: {
      author: 'Lily Anderson',
      timestamp: '1 day ago'
    }
  },
  {
    id: 5,
    title: 'How to validate a startup idea?',
    author: 'Michael Zhang',
    authorAvatar: '',
    club: 'Entrepreneurship Cell',
    timestamp: '3 days ago',
    replies: 18,
    views: 278,
    tags: ['Startups', 'Business'],
    lastReply: {
      author: 'Chris Lee',
      timestamp: '5 hours ago'
    }
  }
];

export const myRegistrations = [
  {
    eventId: 2,
    registeredAt: '2024-03-01',
    status: 'confirmed',
    event: events[1]
  },
  {
    eventId: 4,
    registeredAt: '2024-03-02',
    status: 'confirmed',
    event: events[3]
  },
  {
    eventId: 6,
    registeredAt: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    event: events.find(e => e.id === 6) || events[5]
  },
  {
    eventId: 7,
    registeredAt: '2024-02-15',
    status: 'confirmed',
    event: events.find(e => e.id === 7) || events[6]
  }
];

// User profile state - can be edited
export let userProfile = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  year: '3rd Year',
  course: 'Computer Science',
  studentId: 'CS2021001',
  interests: ['Programming', 'AI/ML', 'Web Development', 'Photography', 'Music'],
  clubs: [
    { id: 1, name: 'Tech Society', role: 'Member' },
    { id: 2, name: 'Photography Club', role: 'Member' }
  ],
  avatar: 'JD',
  bio: 'Passionate about technology and creative arts. Always learning something new!',
  joinDate: '2022-09-01',
  totalEvents: 12,
  certificates: 3
};

export const updateUserProfile = (updates) => {
  userProfile = { ...userProfile, ...updates };
  return userProfile;
};

export const pastEvents = [
  {
    id: 6,
    title: 'Web Development Workshop',
    club: 'Tech Society',
    date: '2024-02-15',
    status: 'completed',
    certificate: true
  },
  {
    id: 7,
    title: 'Photography Basics',
    club: 'Photography Club',
    date: '2024-02-10',
    status: 'completed',
    certificate: true
  },
  {
    id: 8,
    title: 'Coding Competition',
    club: 'Tech Society',
    date: '2024-01-20',
    status: 'completed',
    certificate: false
  }
];

export const eventGallery = {
  1: [
    { id: 1, eventId: 6, title: 'Web Development Workshop', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', date: '2024-02-15' },
    { id: 2, eventId: 7, title: 'AI/ML Bootcamp', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop', date: '2024-01-10' },
    { id: 3, eventId: 8, title: 'Coding Competition', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop', date: '2024-01-20' },
    { id: 4, eventId: 9, title: 'Tech Talk Series', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', date: '2023-12-05' },
    { id: 5, eventId: 10, title: 'Hackathon 2023', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', date: '2023-11-15' },
    { id: 6, eventId: 11, title: 'Startup Showcase', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', date: '2023-10-20' }
  ],
  2: [
    { id: 1, eventId: 12, title: 'Photo Walk', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop', date: '2024-02-05' },
    { id: 2, eventId: 13, title: 'Portrait Workshop', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', date: '2024-01-15' },
    { id: 3, eventId: 14, title: 'Exhibition 2024', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', date: '2024-02-20' },
    { id: 4, eventId: 15, title: 'Nature Photography', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=300&fit=crop', date: '2023-12-10' }
  ],
  3: [
    { id: 1, eventId: 16, title: 'Debate Championship', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', date: '2024-01-25' },
    { id: 2, eventId: 17, title: 'Public Speaking Workshop', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', date: '2023-12-15' }
  ],
  4: [
    { id: 1, eventId: 18, title: 'Open Mic Night', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', date: '2024-02-12' },
    { id: 2, eventId: 19, title: 'Music Festival', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', date: '2023-11-20' }
  ],
  5: [
    { id: 1, eventId: 20, title: 'Startup Pitch Day', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', date: '2024-01-30' },
    { id: 2, eventId: 21, title: 'Entrepreneurship Summit', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', date: '2023-12-01' }
  ]
};

export const clubDetails = {
  1: {
    ...clubs[0],
    history: 'Founded in 2018, Tech Society has been at the forefront of technological innovation on campus. We started with just 20 members and have grown to become one of the largest and most active clubs, organizing hackathons, workshops, and tech talks throughout the year.',
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
    vicePresident: {
      name: 'Maria Garcia',
      email: 'maria.garcia@university.edu',
      role: 'Vice President',
      year: '3rd Year'
    },
    pastEvents: [
      { id: 6, title: 'Web Development Workshop', date: '2024-02-15', participants: 45 },
      { id: 7, title: 'AI/ML Bootcamp', date: '2024-01-10', participants: 78 },
      { id: 8, title: 'Coding Competition', date: '2024-01-20', participants: 120 }
    ],
    achievements: [
      'Won Best Tech Club Award 2023',
      'Organized largest campus hackathon with 200+ participants',
      'Published 15+ research papers by members'
    ]
  },
  2: {
    ...clubs[1],
    history: 'Photography Club was established in 2019 to bring together photography enthusiasts. We organize regular photo walks, workshops, and exhibitions to showcase student talent.',
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
    vicePresident: {
      name: 'David Kim',
      email: 'david.kim@university.edu',
      role: 'Vice President',
      year: '2nd Year'
    },
    pastEvents: [
      { id: 9, title: 'Photo Walk', date: '2024-02-05', participants: 25 },
      { id: 10, title: 'Portrait Photography Workshop', date: '2024-01-15', participants: 30 }
    ],
    achievements: [
      'Annual photography exhibition with 100+ submissions',
      'Collaborated with local galleries for student showcases'
    ]
  }
};

export const eventFees = {
  1: { amount: 500, currency: 'INR' },
  2: { amount: 0, currency: 'INR' },
  3: { amount: 300, currency: 'INR' },
  4: { amount: 0, currency: 'INR' },
  5: { amount: 1000, currency: 'INR' },
  6: { amount: 0, currency: 'INR' },
  7: { amount: 0, currency: 'INR' },
  8: { amount: 200, currency: 'INR' },
  9: { amount: 0, currency: 'INR' },
  10: { amount: 150, currency: 'INR' },
  11: { amount: 250, currency: 'INR' },
  12: { amount: 100, currency: 'INR' }
};

// User's club memberships - can be updated
export let userClubMemberships = [1, 2]; // Club IDs user is member of

export const joinClub = (clubId) => {
  if (!userClubMemberships.includes(clubId)) {
    userClubMemberships.push(clubId);
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      userProfile.clubs.push({ id: clubId, name: club.name, role: 'Member' });
    }
  }
  return userClubMemberships;
};

export const leaveClub = (clubId) => {
  userClubMemberships = userClubMemberships.filter(id => id !== clubId);
  userProfile.clubs = userProfile.clubs.filter(c => c.id !== clubId);
  return userClubMemberships;
};

// User's event registrations - can be updated
export let userEventRegistrations = [2, 4, 6, 7]; // Event IDs user is registered for

export const cancelRegistration = (eventId) => {
  userEventRegistrations = userEventRegistrations.filter(id => id !== eventId);
  const index = myRegistrations.findIndex(reg => reg.eventId === eventId);
  if (index !== -1) {
    myRegistrations.splice(index, 1);
  }
  return userEventRegistrations;
};
