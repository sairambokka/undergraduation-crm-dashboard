'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/hooks/useStudents';
import { useCommunications } from '@/hooks/useCommunications';
import { studentsService } from '@/services/api/students';
import { Student, FilterOptions, ApplicationStatus } from '@/types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const {
    students,
    isLoading,
    filters,
    updateFilters,
    totalCount
  } = useStudents({ pageSize: 20 });
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await studentsService.getStudentStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const quickFilters = useMemo(() => [
    {
      name: 'Active this week',
      count: dashboardStats?.active || 0,
      onClick: () => handleFilterChange({ lastActiveFilter: 'week' })
    },
    {
      name: 'High intent (Applying+)',
      count: (dashboardStats?.statusBreakdown?.Applying || 0) + (dashboardStats?.statusBreakdown?.Submitted || 0),
      onClick: () => handleFilterChange({ status: 'Applying' })
    },
    {
      name: 'Shortlisting',
      count: dashboardStats?.statusBreakdown?.Shortlisting || 0,
      onClick: () => handleFilterChange({ status: 'Shortlisting' })
    }
  ], [dashboardStats, handleFilterChange]);

  const handleStudentClick = (studentId: string) => {
    router.push(`/student/${studentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track student interactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : dashboardStats?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : dashboardStats?.active || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : dashboardStats?.newThisWeek || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : quickFilters[0]?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Filters</h2>
        <div className="flex flex-wrap gap-3">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={filter.onClick}
              className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="text-sm text-gray-700">{filter.name}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, email, or country..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value as ApplicationStatus || undefined })}
            >
              <option value="">All Statuses</option>
              <option value="Exploring">Exploring</option>
              <option value="Shortlisting">Shortlisting</option>
              <option value="Applying">Applying</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Students ({isLoading ? '...' : totalCount})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => handleStudentClick(student.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.applicationStatus === 'Submitted' ? 'bg-green-100 text-green-800' :
                      student.applicationStatus === 'Applying' ? 'bg-blue-100 text-blue-800' :
                      student.applicationStatus === 'Shortlisting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.applicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(student.lastActive, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.gpa}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}