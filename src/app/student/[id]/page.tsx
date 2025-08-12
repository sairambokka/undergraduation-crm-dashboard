'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockStudents, mockCommunications, mockNotes, mockActivities } from '@/data/mockData';
import { Student, Communication, Note, Activity } from '@/types';
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Layout from '@/components/Layout';

type TabType = 'info' | 'timeline' | 'communications' | 'notes';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [newNote, setNewNote] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email' as Communication['type'],
    content: '',
    direction: 'outbound' as Communication['direction']
  });
  const [showNewCommForm, setShowNewCommForm] = useState(false);

  const student = useMemo(() => 
    mockStudents.find(s => s.id === studentId), 
    [studentId]
  );

  const studentCommunications = useMemo(() =>
    mockCommunications
      .filter(comm => comm.studentId === studentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [studentId]
  );

  const studentNotes = useMemo(() =>
    mockNotes
      .filter(note => note.studentId === studentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [studentId]
  );

  const studentActivities = useMemo(() =>
    mockActivities
      .filter(activity => activity.studentId === studentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [studentId]
  );

  if (!student) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, this would make an API call
      console.log('Adding note:', newNote);
      setNewNote('');
      setShowNewNoteForm(false);
    }
  };

  const handleAddCommunication = () => {
    if (newCommunication.content.trim()) {
      // In a real app, this would make an API call
      console.log('Adding communication:', newCommunication);
      setNewCommunication({ type: 'email', content: '', direction: 'outbound' });
      setShowNewCommForm(false);
    }
  };

  const getProgressBarWidth = () => {
    const statusProgress = {
      'Exploring': 25,
      'Shortlisting': 50,
      'Applying': 75,
      'Submitted': 100
    };
    return statusProgress[student.applicationStatus];
  };

  const tabs = [
    { id: 'info' as TabType, name: 'Basic Info', icon: DocumentTextIcon },
    { id: 'timeline' as TabType, name: 'Timeline', icon: ClockIcon },
    { id: 'communications' as TabType, name: 'Communications', icon: ChatBubbleLeftRightIcon },
    { id: 'notes' as TabType, name: 'Internal Notes', icon: DocumentTextIcon }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">{student.email}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Email
            </button>
            <button className="btn-secondary flex items-center">
              <PhoneIcon className="h-4 w-4 mr-2" />
              Call
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Application Progress</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.applicationStatus === 'Submitted' ? 'bg-green-100 text-green-800' :
              student.applicationStatus === 'Applying' ? 'bg-blue-100 text-blue-800' :
              student.applicationStatus === 'Shortlisting' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {student.applicationStatus}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressBarWidth()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Exploring</span>
            <span>Shortlisting</span>
            <span>Applying</span>
            <span>Submitted</span>
          </div>
        </div>

        {/* AI Summary Mock */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border border-purple-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            AI Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {student.name} is a highly motivated {student.grade.toLowerCase()} with a {student.gpa} GPA interested in {student.fieldOfStudy}. 
            Based on their activity, they show strong engagement with the platform and have added {student.colleges.length} colleges to their list. 
            They prefer {student.preferredRegions.join(', ')} regions and have a budget of ${student.tuitionBudget.toLocaleString()}. 
            Recent activity suggests they are actively {student.applicationStatus.toLowerCase()} and would benefit from 
            {student.applicationStatus === 'Exploring' ? 'college selection guidance' : 
             student.applicationStatus === 'Shortlisting' ? 'application strategy support' : 'essay and application assistance'}.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Information</label>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-900">{student.name}</p>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-gray-600">{student.phone}</p>
                      <p className="text-gray-600">{student.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Academic Information</label>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-900">Grade: {student.grade}</p>
                      <p className="text-gray-900">GPA: {student.gpa}</p>
                      {student.satEnglish && <p className="text-gray-900">SAT English: {student.satEnglish}</p>}
                      {student.satMath && <p className="text-gray-900">SAT Math: {student.satMath}</p>}
                      {student.act && <p className="text-gray-900">ACT: {student.act}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferences</label>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-900">Field of Study: {student.fieldOfStudy}</p>
                      <p className="text-gray-900">Tuition Budget: ${student.tuitionBudget.toLocaleString()}</p>
                      <p className="text-gray-900">Preferred Regions: {student.preferredRegions.join(', ')}</p>
                      <p className="text-gray-900">Class Strength: {student.classStrength}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">My Colleges ({student.colleges.length})</label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {student.colleges.map((college) => (
                        <div key={college.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{college.name}</p>
                            <p className="text-xs text-gray-500">{college.city}, {college.state}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            college.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                            college.status === 'Applied' || college.status === 'Applying' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {college.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {studentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(activity.timestamp, 'MMM d, yyyy h:mm a')} • {activity.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Communication History</h3>
                  <button
                    onClick={() => setShowNewCommForm(true)}
                    className="btn-primary flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Log Communication
                  </button>
                </div>

                {showNewCommForm && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex space-x-3">
                      <select
                        value={newCommunication.type}
                        onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value as Communication['type'] })}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="call">Call</option>
                        <option value="meeting">Meeting</option>
                      </select>
                      <select
                        value={newCommunication.direction}
                        onChange={(e) => setNewCommunication({ ...newCommunication, direction: e.target.value as Communication['direction'] })}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="outbound">Outbound</option>
                        <option value="inbound">Inbound</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Communication details..."
                      value={newCommunication.content}
                      onChange={(e) => setNewCommunication({ ...newCommunication, content: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowNewCommForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCommunication}
                        className="btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentCommunications.map((comm) => (
                    <div key={comm.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            comm.type === 'email' ? 'bg-blue-100 text-blue-700' :
                            comm.type === 'call' ? 'bg-green-100 text-green-700' :
                            comm.type === 'sms' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {comm.type.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            comm.direction === 'inbound' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {comm.direction === 'inbound' ? '← Inbound' : '→ Outbound'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(comm.timestamp, 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-900 text-sm">{comm.content}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {comm.staffMember}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Internal Notes</h3>
                  <button
                    onClick={() => setShowNewNoteForm(true)}
                    className="btn-primary flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                </div>

                {showNewNoteForm && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <textarea
                      placeholder="Add internal note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowNewNoteForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddNote}
                        className="btn-primary"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentNotes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{note.author}</span>
                          {note.isPrivate && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                              Private
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {format(note.timestamp, 'MMM d, yyyy h:mm a')}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-900 text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}