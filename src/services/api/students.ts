import { Student, FilterOptions } from '@/types';
import { ApiResponse, PaginatedResponse, apiClient } from './base';
import { mockStudents } from '@/data/mockData';

export interface StudentFilters extends FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'createdAt' | 'lastActive' | 'gpa';
  sortOrder?: 'asc' | 'desc';
}

export class StudentsService {
  async getStudents(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    try {
      let filteredStudents = [...mockStudents];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredStudents = filteredStudents.filter(student =>
          student.name.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower) ||
          student.country.toLowerCase().includes(searchLower)
        );
      }

      if (filters.status) {
        filteredStudents = filteredStudents.filter(student => 
          student.applicationStatus === filters.status
        );
      }

      if (filters.country) {
        filteredStudents = filteredStudents.filter(student => 
          student.country === filters.country
        );
      }

      if (filters.grade) {
        filteredStudents = filteredStudents.filter(student => 
          student.grade === filters.grade
        );
      }

      if (filters.lastActiveFilter) {
        const now = new Date();
        filteredStudents = filteredStudents.filter(student => {
          const daysDiff = Math.floor((now.getTime() - student.lastActive.getTime()) / (1000 * 60 * 60 * 24));
          if (filters.lastActiveFilter === 'week') return daysDiff <= 7;
          if (filters.lastActiveFilter === 'month') return daysDiff <= 30;
          return true;
        });
      }

      if (filters.sortBy) {
        filteredStudents.sort((a, b) => {
          const aValue = a[filters.sortBy as keyof Student];
          const bValue = b[filters.sortBy as keyof Student];
          
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          
          if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
          if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 25;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

      return {
        data: paginatedStudents,
        total: filteredStudents.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredStudents.length / pageSize),
      };
    } catch (error) {
      throw new Error('Failed to fetch students');
    }
  }

  async getStudentById(id: string): Promise<Student | null> {
    try {
      return mockStudents.find(student => student.id === id) || null;
    } catch (error) {
      throw new Error('Failed to fetch student');
    }
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<ApiResponse<Student>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const student = mockStudents.find(s => s.id === id);
      if (!student) {
        throw new Error('Student not found');
      }

      Object.assign(student, updates);

      return {
        data: student,
        success: true,
        message: 'Student updated successfully',
      };
    } catch (error) {
      throw new Error('Failed to update student');
    }
  }

  async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'lastActive'>): Promise<ApiResponse<Student>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`,
        createdAt: new Date(),
        lastActive: new Date(),
      };

      mockStudents.push(newStudent);

      return {
        data: newStudent,
        success: true,
        message: 'Student created successfully',
      };
    } catch (error) {
      throw new Error('Failed to create student');
    }
  }

  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockStudents.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('Student not found');
      }

      mockStudents.splice(index, 1);

      return {
        data: undefined,
        success: true,
        message: 'Student deleted successfully',
      };
    } catch (error) {
      throw new Error('Failed to delete student');
    }
  }

  async getStudentStats(): Promise<{
    total: number;
    active: number;
    newThisWeek: number;
    statusBreakdown: Record<string, number>;
  }> {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        total: mockStudents.length,
        active: mockStudents.filter(s => s.lastActive > monthAgo).length,
        newThisWeek: mockStudents.filter(s => s.createdAt > weekAgo).length,
        statusBreakdown: mockStudents.reduce((acc, student) => {
          acc[student.applicationStatus] = (acc[student.applicationStatus] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      return stats;
    } catch (error) {
      throw new Error('Failed to fetch student stats');
    }
  }
}

export const studentsService = new StudentsService();