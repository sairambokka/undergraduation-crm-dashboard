import { v4 as uuidv4 } from 'uuid';
import { Student, Communication, Note, Activity, ApplicationStatus, SchoolYear, Region } from '@/types';

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Mason', 'Isabella', 'James',
  'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Sebastian',
  'Abigail', 'Jackson', 'Emily', 'Aiden', 'Elizabeth', 'Matthew', 'Mila', 'Samuel', 'Ella', 'David'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Singapore', 'Germany', 
  'France', 'South Korea', 'Japan', 'Brazil', 'Mexico', 'Netherlands', 'Sweden', 'Switzerland'
];

const fieldsOfStudy = [
  'Computer Science', 'Business Administration', 'Engineering', 'Psychology', 'Biology',
  'Economics', 'Political Science', 'English Literature', 'Mathematics', 'Physics',
  'Chemistry', 'Pre-Medicine', 'Art History', 'International Relations', 'Environmental Science'
];

const classStrengths = [
  'Small (Under 5,000)', 'Medium (5,000-15,000)', 'Large (15,000-30,000)', 'Very Large (30,000+)'
];

const colleges = [
  { name: 'Harvard University', city: 'Cambridge', state: 'MA' },
  { name: 'Stanford University', city: 'Stanford', state: 'CA' },
  { name: 'MIT', city: 'Cambridge', state: 'MA' },
  { name: 'Yale University', city: 'New Haven', state: 'CT' },
  { name: 'Princeton University', city: 'Princeton', state: 'NJ' },
  { name: 'Columbia University', city: 'New York', state: 'NY' },
  { name: 'University of Chicago', city: 'Chicago', state: 'IL' },
  { name: 'University of Pennsylvania', city: 'Philadelphia', state: 'PA' },
  { name: 'Northwestern University', city: 'Evanston', state: 'IL' },
  { name: 'Duke University', city: 'Durham', state: 'NC' }
];

const applicationStatuses: ApplicationStatus[] = ['Exploring', 'Shortlisting', 'Applying', 'Submitted'];
const schoolYears: SchoolYear[] = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const regions: Region[] = ['Northeast', 'Midwest', 'South', 'West'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockStudents(count: number = 75): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date());
    const lastActive = generateRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    // Generate colleges for this student
    const studentColleges = getRandomElements(colleges, Math.floor(Math.random() * 8) + 2).map(college => ({
      id: uuidv4(),
      name: college.name,
      city: college.city,
      state: college.state,
      status: getRandomElement(['Exploring', 'Shortlisted', 'Applying', 'Applied', 'Submitted'] as const),
      addedAt: generateRandomDate(createdAt, new Date())
    }));

    const student: Student = {
      id: uuidv4(),
      name,
      email,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      country: getRandomElement(countries),
      grade: getRandomElement(schoolYears),
      gpa: Math.round((Math.random() * 2 + 2.5) * 100) / 100, // 2.5 - 4.5 GPA
      satEnglish: Math.random() > 0.3 ? Math.floor(Math.random() * 400) + 400 : undefined, // 400-800
      satMath: Math.random() > 0.3 ? Math.floor(Math.random() * 400) + 400 : undefined, // 400-800
      act: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 16 : undefined, // 16-36
      fieldOfStudy: getRandomElement(fieldsOfStudy),
      tuitionBudget: Math.floor(Math.random() * 60000) + 20000, // $20k - $80k
      preferredRegions: getRandomElements(regions, Math.floor(Math.random() * 3) + 1),
      classStrength: getRandomElement(classStrengths),
      applicationStatus: getRandomElement(applicationStatuses),
      lastActive,
      createdAt,
      colleges: studentColleges
    };

    students.push(student);
  }

  return students;
}

export function generateMockCommunications(students: Student[]): Communication[] {
  const communications: Communication[] = [];
  const types: Communication['type'][] = ['email', 'sms', 'call', 'meeting'];
  const directions: Communication['direction'][] = ['inbound', 'outbound'];
  
  const templates = {
    email: [
      'Welcome email sent with getting started guide',
      'Follow-up on college selection process',
      'Essay review feedback provided',
      'Application deadline reminder',
      'Scholarship opportunity notification'
    ],
    sms: [
      'Quick check-in on application progress',
      'Reminder about upcoming deadline',
      'Congratulations on college acceptance'
    ],
    call: [
      'Initial consultation call completed',
      'College selection discussion',
      'Essay brainstorming session',
      'Application strategy meeting'
    ],
    meeting: [
      'In-person college counseling session',
      'Parent-student strategy meeting',
      'Mock interview practice'
    ]
  };

  students.forEach(student => {
    const numCommunications = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < numCommunications; i++) {
      const type = getRandomElement(types);
      const communication: Communication = {
        id: uuidv4(),
        studentId: student.id,
        type,
        content: getRandomElement(templates[type]),
        timestamp: generateRandomDate(student.createdAt, new Date()),
        staffMember: getRandomElement(['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'James Wilson', 'Anna Rodriguez']),
        direction: getRandomElement(directions)
      };
      
      communications.push(communication);
    }
  });

  return communications;
}

export function generateMockNotes(students: Student[]): Note[] {
  const notes: Note[] = [];
  
  const noteTemplates = [
    'Student is very motivated and organized',
    'Parents are heavily involved in the process',
    'Strong academic performance but needs essay help',
    'Interested in STEM programs specifically',
    'Budget constraints may limit options',
    'Excellent extracurricular activities',
    'Needs help with standardized test prep',
    'Very responsive to communication',
    'Has clear career goals in mind',
    'Considering gap year options'
  ];

  students.forEach(student => {
    const numNotes = Math.floor(Math.random() * 5);
    
    for (let i = 0; i < numNotes; i++) {
      const note: Note = {
        id: uuidv4(),
        studentId: student.id,
        content: getRandomElement(noteTemplates),
        author: getRandomElement(['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'James Wilson', 'Anna Rodriguez']),
        timestamp: generateRandomDate(student.createdAt, new Date()),
        isPrivate: Math.random() > 0.7
      };
      
      notes.push(note);
    }
  });

  return notes;
}

export function generateMockActivities(students: Student[]): Activity[] {
  const activities: Activity[] = [];
  
  const activityTypes: Activity['type'][] = [
    'login', 'search', 'college_view', 'college_add', 'document_upload', 'ai_question'
  ];

  const activityDescriptions = {
    login: ['User logged in via Google OAuth', 'User logged in via email'],
    search: ['Searched for colleges in California', 'Filtered colleges by tuition budget', 'Searched for engineering programs'],
    college_view: ['Viewed Harvard University profile', 'Viewed Stanford University details', 'Checked admission requirements'],
    college_add: ['Added MIT to My Colleges', 'Added Yale to shortlist', 'Saved Columbia University'],
    document_upload: ['Uploaded transcript', 'Submitted essay draft', 'Added recommendation letter'],
    ai_question: ['Asked about college admissions', 'Inquired about essay topics', 'Asked for career advice']
  };

  students.forEach(student => {
    const numActivities = Math.floor(Math.random() * 25) + 5;
    
    for (let i = 0; i < numActivities; i++) {
      const type = getRandomElement(activityTypes);
      const activity: Activity = {
        id: uuidv4(),
        studentId: student.id,
        type,
        description: getRandomElement(activityDescriptions[type]),
        timestamp: generateRandomDate(student.createdAt, new Date()),
        metadata: type === 'college_view' ? { collegeId: uuidv4() } : undefined
      };
      
      activities.push(activity);
    }
  });

  return activities;
}

// Generate all mock data
export const mockStudents = generateMockStudents(75);
export const mockCommunications = generateMockCommunications(mockStudents);
export const mockNotes = generateMockNotes(mockStudents);
export const mockActivities = generateMockActivities(mockStudents);