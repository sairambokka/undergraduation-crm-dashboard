import { useState, useEffect, useCallback } from 'react';
import { Communication } from '@/types';
import { 
  communicationsService, 
  CommunicationFilters, 
  CreateCommunicationData 
} from '@/services/api/communications';

export interface UseCommunicationsReturn {
  communications: (Communication & { studentName?: string })[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: CommunicationFilters;
  fetchCommunications: (newFilters?: CommunicationFilters) => Promise<void>;
  updateFilters: (newFilters: Partial<CommunicationFilters>) => void;
  clearFilters: () => void;
  createCommunication: (data: CreateCommunicationData) => Promise<void>;
  refreshCommunications: () => Promise<void>;
}

export function useCommunications(initialFilters: CommunicationFilters = {}): UseCommunicationsReturn {
  const [communications, setCommunications] = useState<(Communication & { studentName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<CommunicationFilters>(initialFilters);

  const fetchCommunications = useCallback(async (newFilters?: CommunicationFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      const response = await communicationsService.getCommunications(filtersToUse);
      
      setCommunications(response.data);
      setTotalCount(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      
      if (newFilters) {
        setFilters(filtersToUse);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch communications';
      setError(errorMessage);
      console.error('Failed to fetch communications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<CommunicationFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchCommunications(updatedFilters);
  }, [filters, fetchCommunications]);

  const clearFilters = useCallback(() => {
    const clearedFilters: CommunicationFilters = {
      page: 1,
      pageSize: filters.pageSize || 25,
    };
    setFilters(clearedFilters);
    fetchCommunications(clearedFilters);
  }, [filters.pageSize, fetchCommunications]);

  const createCommunication = useCallback(async (data: CreateCommunicationData) => {
    try {
      setError(null);
      await communicationsService.createCommunication(data);
      await fetchCommunications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create communication';
      setError(errorMessage);
      throw err;
    }
  }, [fetchCommunications]);

  const refreshCommunications = useCallback(() => {
    return fetchCommunications();
  }, [fetchCommunications]);

  useEffect(() => {
    fetchCommunications();
  }, []);

  return {
    communications,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    filters,
    fetchCommunications,
    updateFilters,
    clearFilters,
    createCommunication,
    refreshCommunications,
  };
}

export interface UseCommunicationStatsReturn {
  stats: {
    total: number;
    byType: Record<Communication['type'], number>;
    byDirection: Record<Communication['direction'], number>;
    recentActivity: Communication[];
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export function useCommunicationStats(): UseCommunicationStatsReturn {
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<Communication['type'], number>;
    byDirection: Record<Communication['direction'], number>;
    recentActivity: Communication[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedStats = await communicationsService.getCommunicationStats();
      setStats(fetchedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch communication stats';
      setError(errorMessage);
      console.error('Failed to fetch communication stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
}