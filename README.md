# Undergraduation CRM Dashboard

A comprehensive internal CRM dashboard for managing student interactions and tracking college application journeys on the undergraduation.com platform.

## 🚀 Features

### Core Pages & Navigation
- **Dashboard**: Overview with stats, quick filters, and recent student activity
- **Students Page**: Complete student directory with advanced filtering and search
- **Communications Page**: Centralized communication history across all students  
- **Individual Student Profiles**: Detailed view with tabs for info, timeline, communications, and notes

### Key Functionality
- **Advanced Search & Filtering**: Multi-criteria filtering by status, grade, country, activity
- **Communication Tracking**: Log and track emails, calls, SMS, and meetings with full history
- **Internal Notes System**: Team collaboration with private/public notes
- **Progress Tracking**: Visual progress bars and status indicators
- **Analytics Dashboard**: Real-time stats and actionable insights
- **AI Summary**: Intelligent student profile summaries (mocked)
- **Clickable Navigation**: Seamless navigation between student profiles

### Recent Enhancements
- ✅ **Service Layer Architecture**: Clean separation of API logic and UI components
- ✅ **Custom React Hooks**: Optimized data fetching with `useStudents`, `useCommunications`, `useAuth`
- ✅ **Advanced Pagination**: Server-side pagination with state management
- ✅ **Real-time Filtering**: Live search and filter updates
- ✅ **Improved UX**: Clickable student rows across all pages
- ✅ **Better Error Handling**: Comprehensive validation and error states
- ✅ **TypeScript Integration**: Full type safety throughout the application

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3.4 (downgraded for stability)
- **Icons**: Heroicons 2.2
- **Date Handling**: date-fns 4.1
- **Utilities**: clsx for conditional styling

### Architecture
- **State Management**: Custom React hooks with service layer
- **API Layer**: Service-based architecture with base HTTP client
- **Authentication**: Mock implementation (Firebase Auth ready) 
- **Data Layer**: Mock data with realistic generation (Firebase Firestore ready)
- **Type Safety**: Comprehensive TypeScript definitions throughout
- **Validation**: Client-side validation with custom validators

## 📊 Data Points Tracked

Based on the undergraduation.com platform analysis, the CRM tracks:

### Student Information
- Basic details (name, email, phone, country)
- Academic info (GPA, SAT/ACT scores, grade level)
- Preferences (field of study, tuition budget, preferred regions)
- Application status and progress

### Activity Tracking
- Login activity and OAuth data
- College searches and selections
- Document submissions
- AI questions asked
- Platform engagement metrics

### Communication History
- Email interactions
- SMS communications
- Phone calls
- In-person meetings
- Staff member assignments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd undergraduation-crm-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

The application includes a mock authentication system:

- **Email**: `admin@example.com`
- **Password**: `password`

> Note: The login form is pre-filled with these credentials for convenience.

## 🎯 Usage Guide

### 1. Authentication
- Access the login page at the root URL
- Use the provided demo credentials
- Successfully logged-in users are redirected to the dashboard

### 2. Dashboard Overview
- View total student metrics and quick stats
- Use quick filters for common actions:
  - Students not contacted in 7 days
  - High intent students (Applying/Submitted)
  - Students needing essay help
- Search students by name, email, or country
- Filter by application status

### 3. Students Page
- Access comprehensive student directory via navigation
- Advanced filtering by status, grade, country, and activity
- Real-time search across names, emails, and countries
- Click any student row to view detailed profile
- Pagination with configurable page sizes

### 4. Communications Page  
- View all student communications in one place
- Filter by communication type (email, SMS, call, meeting)
- Filter by direction (inbound/outbound) and staff member
- Statistics overview with communication counts
- Direct navigation to student profiles

### 5. Student Profiles
- Click any student row from dashboard or students page
- Navigate through tabs:
  - **Basic Info**: Contact details, academic info, preferences, college list
  - **Timeline**: Activity history and engagement tracking  
  - **Communications**: Multi-channel communication history with logging
  - **Internal Notes**: Team collaboration with private/public notes

### 6. Communication Tracking
- Log new communications from student profile pages
- Track email, SMS, call, and meeting interactions
- View communication history with timestamps and staff attribution
- Access centralized communication view from main navigation

### 7. Notes Management
- Add internal team notes for each student
- Mark notes as private for sensitive information
- Edit and delete notes with proper attribution
- Team collaboration features

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── communications/    # Communications page and layout
│   ├── dashboard/         # Dashboard page and layout
│   ├── login/             # Authentication page
│   ├── students/          # Students directory page and layout
│   ├── student/[id]/      # Dynamic student profile routes
│   ├── layout.tsx         # Root layout with CSS imports
│   ├── page.tsx           # Home redirect to login
│   └── globals.css        # Tailwind CSS and global styles
├── components/            # Reusable React components
│   └── Layout.tsx         # Main dashboard layout with navigation
├── hooks/                 # Custom React hooks ✨ NEW
│   ├── useAuth.ts         # Authentication state management
│   ├── useStudents.ts     # Students data fetching and filtering
│   └── useCommunications.ts # Communications data management
├── services/              # API layer and business logic ✨ NEW
│   ├── api/
│   │   ├── base.ts        # Base HTTP client and error handling
│   │   ├── students.ts    # Students CRUD operations
│   │   └── communications.ts # Communications API
│   └── auth.ts            # Authentication service
├── utils/                 # Helper functions ✨ NEW
│   ├── formatters.ts      # Date, currency, phone formatting
│   ├── validators.ts      # Form validation logic
│   └── helpers.ts         # Common utility functions
├── data/                  # Mock data generation
│   └── mockData.ts        # Realistic student, communication, activity data
├── lib/                   # Configuration and utilities
│   └── firebase.ts        # Firebase configuration (ready for integration)
└── types/                 # TypeScript type definitions
    └── index.ts           # All interface definitions
```

## 🎨 Design Decisions

### UI/UX
- **Clean, Professional Design**: Follows CRM industry standards
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Clear sidebar with logical organization
- **Color Coding**: Status indicators and progress visualization
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Technical Architecture
- **Service Layer**: Clean separation of API logic from UI components
- **Custom Hooks**: Optimized data fetching with `useStudents`, `useCommunications`, `useAuth`
- **Type Safety**: Comprehensive TypeScript definitions throughout
- **State Management**: Hook-based state with service integration
- **Error Handling**: Comprehensive validation and error boundaries
- **Scalable Structure**: Clear separation of concerns for easy maintenance
- **Performance**: Pagination, filtering, and optimized re-renders

### Data Modeling
- **Comprehensive Student Profiles**: All required data points from assessment
- **Activity Tracking**: Complete engagement history
- **Communication Logs**: Multi-channel communication tracking
- **Flexible Notes System**: Team collaboration features

## 🔮 Future Enhancements

### Backend Integration
- [ ] **Firebase Integration**: Replace mock services with real Firebase Auth and Firestore
- [ ] **Real-time Updates**: WebSocket connections for live data updates
- [ ] **API Rate Limiting**: Implement proper API throttling and caching
- [ ] **Data Export**: CSV, PDF, and Excel export functionality

### Advanced Features  
- [ ] **Advanced Analytics**: Detailed reporting and insights dashboard
- [ ] **Bulk Operations**: Multi-student actions and batch updates
- [ ] **Email Integration**: Direct email sending through Customer.io
- [ ] **Calendar Integration**: Meeting scheduling and calendar sync
- [ ] **Task Management**: Reminders and follow-up system
- [ ] **Mobile Responsiveness**: Enhanced mobile experience

### Performance & Scale
- [ ] **Virtual Scrolling**: Handle thousands of students efficiently
- [ ] **Advanced Caching**: Redis integration for improved performance  
- [ ] **Search Optimization**: ElasticSearch for complex queries
- [ ] **Image Optimization**: Student photo management and CDN integration

## 🐛 Known Issues

- **Mock Authentication**: Data persists in localStorage only (cleared on browser reset)
- **No Real Backend**: All data is generated and stored client-side
- **Email Notifications**: Communication logging is mocked (no actual emails sent)  
- **Limited File Uploads**: Student document management not implemented
- **Mobile Optimization**: Some responsive design improvements needed
- **Real-time Features**: No live notifications or collaborative editing

## 🧪 Development Notes

### Recent Architecture Improvements
- **Migrated to Service Layer**: Separated API logic from UI components for better maintainability
- **Added Custom Hooks**: Optimized data fetching and state management with `useStudents`, `useCommunications`, `useAuth`
- **Enhanced TypeScript**: Full type safety with comprehensive error handling and validation
- **Improved UX**: Consistent clickable rows across all pages and better navigation flow
- **CSS Stability**: Downgraded to Tailwind v3 for better compatibility and resolved styling issues
- **New Pages Added**: Students directory page and Communications overview page
- **Better Organization**: Utils folder with formatters, validators, and helper functions

### When Transitioning to Real Backend
The service layer architecture makes backend integration seamless:
1. **Update Service URLs**: Change base URLs in `services/api/base.ts`
2. **Replace Mock Data**: Update service methods to use real API endpoints  
3. **Add Authentication**: Integrate Firebase Auth in `services/auth.ts`
4. **Update Hooks**: Custom hooks will automatically work with real data
5. **No Component Changes**: UI components remain unchanged due to service abstraction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Undergraduation.com team**