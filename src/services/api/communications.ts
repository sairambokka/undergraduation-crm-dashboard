import { Communication } from '@/types';
import { ApiResponse, PaginatedResponse } from './base';
import { mockCommunications, mockStudents } from '@/data/mockData';

export interface CommunicationFilters {
  studentId?: string;
  type?: Communication['type'];
  direction?: Communication['direction'];
  staffMember?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'timestamp' | 'type' | 'staffMember';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCommunicationData {
  studentId: string;
  type: Communication['type'];
  content: string;
  direction: Communication['direction'];
  staffMember: string;
}

export class CommunicationsService {
  async getCommunications(filters: CommunicationFilters = {}): Promise<PaginatedResponse<Communication & { studentName?: string }>> {
    try {
      let filteredComms = [...mockCommunications];

      if (filters.studentId) {
        filteredComms = filteredComms.filter(comm => comm.studentId === filters.studentId);
      }

      if (filters.type) {
        filteredComms = filteredComms.filter(comm => comm.type === filters.type);
      }

      if (filters.direction) {
        filteredComms = filteredComms.filter(comm => comm.direction === filters.direction);
      }

      if (filters.staffMember) {
        filteredComms = filteredComms.filter(comm => comm.staffMember === filters.staffMember);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const studentsMap = new Map(mockStudents.map(s => [s.id, s]));
        
        filteredComms = filteredComms.filter(comm => {
          const student = studentsMap.get(comm.studentId);
          return comm.content.toLowerCase().includes(searchLower) ||
                 comm.staffMember.toLowerCase().includes(searchLower) ||
                 student?.name.toLowerCase().includes(searchLower) ||
                 student?.email.toLowerCase().includes(searchLower);
        });
      }

      filteredComms.sort((a, b) => {
        if (filters.sortBy === 'timestamp') {
          const order = filters.sortOrder === 'asc' ? 1 : -1;
          return (a.timestamp.getTime() - b.timestamp.getTime()) * order;
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      const studentsMap = new Map(mockStudents.map(s => [s.id, s]));
      const enrichedComms = filteredComms.map(comm => ({
        ...comm,
        studentName: studentsMap.get(comm.studentId)?.name,
      }));

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 25;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComms = enrichedComms.slice(startIndex, endIndex);

      return {
        data: paginatedComms,
        total: filteredComms.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredComms.length / pageSize),
      };
    } catch (error) {
      throw new Error('Failed to fetch communications');
    }
  }

  async getCommunicationById(id: string): Promise<Communication | null> {
    try {
      return mockCommunications.find(comm => comm.id === id) || null;
    } catch (error) {
      throw new Error('Failed to fetch communication');
    }
  }

  async createCommunication(data: CreateCommunicationData): Promise<ApiResponse<Communication>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newCommunication: Communication = {
        ...data,
        id: `comm-${Date.now()}`,
        timestamp: new Date(),
      };

      mockCommunications.push(newCommunication);

      return {
        data: newCommunication,
        success: true,
        message: 'Communication logged successfully',
      };
    } catch (error) {
      throw new Error('Failed to create communication');
    }
  }

  async updateCommunication(id: string, updates: Partial<Communication>): Promise<ApiResponse<Communication>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const communication = mockCommunications.find(c => c.id === id);
      if (!communication) {
        throw new Error('Communication not found');
      }

      Object.assign(communication, updates);

      return {
        data: communication,
        success: true,
        message: 'Communication updated successfully',
      };
    } catch (error) {
      throw new Error('Failed to update communication');
    }
  }

  async deleteCommunication(id: string): Promise<ApiResponse<void>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockCommunications.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Communication not found');
      }

      mockCommunications.splice(index, 1);

      return {
        data: undefined,
        success: true,
        message: 'Communication deleted successfully',
      };
    } catch (error) {
      throw new Error('Failed to delete communication');
    }
  }

  async getCommunicationStats(): Promise<{
    total: number;
    byType: Record<Communication['type'], number>;
    byDirection: Record<Communication['direction'], number>;
    recentActivity: Communication[];
  }> {
    try {
      const stats = {
        total: mockCommunications.length,
        byType: {
          email: 0,
          sms: 0,
          call: 0,
          meeting: 0,
        } as Record<Communication['type'], number>,
        byDirection: {
          inbound: 0,
          outbound: 0,
        } as Record<Communication['direction'], number>,
        recentActivity: mockCommunications
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 10),
      };

      mockCommunications.forEach(comm => {
        stats.byType[comm.type]++;
        stats.byDirection[comm.direction]++;
      });

      return stats;
    } catch (error) {
      throw new Error('Failed to fetch communication stats');
    }
  }

  async getStaffMembers(): Promise<string[]> {
    try {
      const staff = new Set(mockCommunications.map(comm => comm.staffMember));
      return Array.from(staff).sort();
    } catch (error) {
      throw new Error('Failed to fetch staff members');
    }
  }
}

export const communicationsService = new CommunicationsService();