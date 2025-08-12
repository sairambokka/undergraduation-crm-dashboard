'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/hooks/useStudents';
import { Student, FilterOptions, ApplicationStatus } from '@/types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function StudentsPage() {
  const router = useRouter();
  const {
    students,
    isLoading,
    totalCount,
    currentPage,
    totalPages,
    filters,
    updateFilters,
    clearFilters: clearAllFilters
  } = useStudents({ pageSize: 25 });

  const uniqueCountries = useMemo(() => 
    Array.from(new Set(students.map(s => s.country))).sort(), 
    [students]
  );

  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };
  
  const handleStudentClick = (studentId: string) => {
    router.push(`/student/${studentId}`);
  };

  // This function is now handled by the clearAllFilters from the hook

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">View and manage all students</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
          
          <div className="flex flex-wrap gap-2">
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

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.grade || ''}
              onChange={(e) => handleFilterChange({ grade: e.target.value as any || undefined })}
            >
              <option value="">All Grades</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.country || ''}
              onChange={(e) => handleFilterChange({ country: e.target.value || undefined })}
            >
              <option value="">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.lastActiveFilter || ''}
              onChange={(e) => handleFilterChange({ lastActiveFilter: e.target.value as any || undefined })}
            >
              <option value="">All Activity</option>
              <option value="week">Active this week</option>
              <option value="month">Active this month</option>
            </select>

            {(filters.search || Object.keys(filters).some(key => filters[key as keyof FilterOptions] && key !== 'page' && key !== 'pageSize')) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{isLoading ? '...' : totalCount} student{totalCount !== 1 ? 's' : ''}</span>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field of Study
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
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.fieldOfStudy}
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
        </div>

        {!isLoading && students.length === 0 && (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}