export type ApplicationStatus = 'Exploring' | 'Shortlisting' | 'Applying' | 'Submitted';

export type SchoolYear = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

export type Region = 'Northeast' | 'Midwest' | 'South' | 'West';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  grade: SchoolYear;
  gpa: number;
  satEnglish?: number;
  satMath?: number;
  act?: number;
  fieldOfStudy: string;
  tuitionBudget: number;
  preferredRegions: Region[];
  classStrength: string;
  applicationStatus: ApplicationStatus;
  lastActive: Date;
  createdAt: Date;
  colleges: College[];
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  status: 'Exploring' | 'Shortlisted' | 'Applying' | 'Applied' | 'Submitted';
  addedAt: Date;
}

export interface Communication {
  id: string;
  studentId: string;
  type: 'email' | 'sms' | 'call' | 'meeting';
  content: string;
  timestamp: Date;
  staffMember: string;
  direction: 'inbound' | 'outbound';
}

export interface Note {
  id: string;
  studentId: string;
  content: string;
  author: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface Activity {
  id: string;
  studentId: string;
  type: 'login' | 'search' | 'college_view' | 'college_add' | 'document_upload' | 'ai_question';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FilterOptions {
  status?: ApplicationStatus;
  country?: string;
  grade?: SchoolYear;
  lastActiveFilter?: 'week' | 'month' | 'all';
  search?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  newThisWeek: number;
}