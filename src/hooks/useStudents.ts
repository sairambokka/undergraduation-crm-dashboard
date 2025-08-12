import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types';
import { studentsService, StudentFilters } from '@/services/api/students';

export interface UseStudentsReturn {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: StudentFilters;
  fetchStudents: (newFilters?: StudentFilters) => Promise<void>;
  updateFilters: (newFilters: Partial<StudentFilters>) => void;
  clearFilters: () => void;
  refreshStudents: () => Promise<void>;
}

export function useStudents(initialFilters: StudentFilters = {}): UseStudentsReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<StudentFilters>(initialFilters);

  const fetchStudents = useCallback(async (newFilters?: StudentFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      const response = await studentsService.getStudents(filtersToUse);
      
      setStudents(response.data);
      setTotalCount(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      
      if (newFilters) {
        setFilters(filtersToUse);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students';
      setError(errorMessage);
      console.error('Failed to fetch students:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<StudentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchStudents(updatedFilters);
  }, [filters, fetchStudents]);

  const clearFilters = useCallback(() => {
    const clearedFilters: StudentFilters = {
      page: 1,
      pageSize: filters.pageSize || 25,
    };
    setFilters(clearedFilters);
    fetchStudents(clearedFilters);
  }, [filters.pageSize, fetchStudents]);

  const refreshStudents = useCallback(() => {
    return fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    filters,
    fetchStudents,
    updateFilters,
    clearFilters,
    refreshStudents,
  };
}

export interface UseStudentReturn {
  student: Student | null;
  isLoading: boolean;
  error: string | null;
  fetchStudent: (id: string) => Promise<void>;
  updateStudent: (updates: Partial<Student>) => Promise<void>;
  refreshStudent: () => Promise<void>;
}

export function useStudent(initialId?: string): UseStudentReturn {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | undefined>(initialId);

  const fetchStudent = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentId(id);
      
      const fetchedStudent = await studentsService.getStudentById(id);
      setStudent(fetchedStudent);
      
      if (!fetchedStudent) {
        setError('Student not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student';
      setError(errorMessage);
      console.error('Failed to fetch student:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (updates: Partial<Student>) => {
    if (!currentId) {
      throw new Error('No student ID available');
    }

    try {
      setError(null);
      const response = await studentsService.updateStudent(currentId, updates);
      setStudent(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student';
      setError(errorMessage);
      throw err;
    }
  }, [currentId]);

  const refreshStudent = useCallback(() => {
    if (!currentId) {
      return Promise.reject(new Error('No student ID available'));
    }
    return fetchStudent(currentId);
  }, [currentId, fetchStudent]);

  useEffect(() => {
    if (initialId) {
      fetchStudent(initialId);
    }
  }, [initialId, fetchStudent]);

  return {
    student,
    isLoading,
    error,
    fetchStudent,
    updateStudent,
    refreshStudent,
  };
}