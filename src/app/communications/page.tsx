'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudents, mockCommunications } from '@/data/mockData';
import { Communication } from '@/types';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  CalendarIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function CommunicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Communication['type'] | ''>('');
  const [directionFilter, setDirectionFilter] = useState<Communication['direction'] | ''>('');
  const [staffFilter, setStaffFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const communicationsPerPage = 25;
  const router = useRouter();

  const studentsMap = useMemo(() => {
    return new Map(mockStudents.map(student => [student.id, student]));
  }, []);

  const staffMembers = useMemo(() => {
    const staff = new Set(mockCommunications.map(comm => comm.staffMember));
    return Array.from(staff).sort();
  }, []);

  const filteredCommunications = useMemo(() => {
    return mockCommunications.filter(comm => {
      const student = studentsMap.get(comm.studentId);
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !comm.content.toLowerCase().includes(searchLower) &&
          !student?.name.toLowerCase().includes(searchLower) &&
          !student?.email.toLowerCase().includes(searchLower) &&
          !comm.staffMember.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (typeFilter && comm.type !== typeFilter) {
        return false;
      }

      if (directionFilter && comm.direction !== directionFilter) {
        return false;
      }

      if (staffFilter && comm.staffMember !== staffFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [mockCommunications, searchTerm, typeFilter, directionFilter, staffFilter, studentsMap]);

  const paginatedCommunications = useMemo(() => {
    const startIndex = (currentPage - 1) * communicationsPerPage;
    return filteredCommunications.slice(startIndex, startIndex + communicationsPerPage);
  }, [filteredCommunications, currentPage]);

  const totalPages = Math.ceil(filteredCommunications.length / communicationsPerPage);

  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4" />;
      case 'sms':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      case 'call':
        return <PhoneIcon className="h-4 w-4" />;
      case 'meeting':
        return <VideoCameraIcon className="h-4 w-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Communication['type']) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-700';
      case 'sms':
        return 'bg-yellow-100 text-yellow-700';
      case 'call':
        return 'bg-green-100 text-green-700';
      case 'meeting':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setDirectionFilter('');
    setStaffFilter('');
    setCurrentPage(1);
  };

  const handleStudentClick = (studentId: string) => {
    router.push(`/student/${studentId}`);
  };

  const communicationStats = useMemo(() => {
    const stats = {
      total: filteredCommunications.length,
      byType: {
        email: 0,
        sms: 0,
        call: 0,
        meeting: 0
      },
      byDirection: {
        inbound: 0,
        outbound: 0
      }
    };

    filteredCommunications.forEach(comm => {
      stats.byType[comm.type]++;
      stats.byDirection[comm.direction]++;
    });

    return stats;
  }, [filteredCommunications]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-1">View and manage all student communications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{communicationStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <EnvelopeIcon className="h-6 w-6 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Emails</p>
              <p className="text-xl font-bold text-gray-900">{communicationStats.byType.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <PhoneIcon className="h-6 w-6 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Calls</p>
              <p className="text-xl font-bold text-gray-900">{communicationStats.byType.call}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <ArrowUpIcon className="h-6 w-6 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Outbound</p>
              <p className="text-xl font-bold text-gray-900">{communicationStats.byDirection.outbound}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <ArrowDownIcon className="h-6 w-6 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Inbound</p>
              <p className="text-xl font-bold text-gray-900">{communicationStats.byDirection.inbound}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search communications by content, student, or staff..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as Communication['type'] || '')}
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value as Communication['direction'] || '')}
            >
              <option value="">All Directions</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            >
              <option value="">All Staff</option>
              {staffMembers.map(staff => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>

            {(searchTerm || typeFilter || directionFilter || staffFilter) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
            <span>{filteredCommunications.length} communication{filteredCommunications.length !== 1 ? 's' : ''}</span>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {paginatedCommunications.map((comm) => {
            const student = studentsMap.get(comm.studentId);
            return (
              <div key={comm.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getTypeColor(comm.type)}`}>
                      {getTypeIcon(comm.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(comm.type)}`}>
                          {comm.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          comm.direction === 'inbound' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {comm.direction === 'inbound' ? '← Inbound' : '→ Outbound'}
                        </span>
                      </div>
                      
                      {student && (
                        <button
                          onClick={() => handleStudentClick(student.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <UserIcon className="h-3 w-3 mr-1" />
                          {student.name}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(comm.timestamp, 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(comm.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="ml-12">
                  <p className="text-gray-900 text-sm mb-2">{comm.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">By: {comm.staffMember}</p>
                    {student && (
                      <button
                        onClick={() => handleStudentClick(student.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedCommunications.length === 0 && (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No communications found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}