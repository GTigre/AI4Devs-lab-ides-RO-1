import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { CandidateHome } from './components/CandidateHome';
import { CandidateList } from './components/CandidateList';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserRole, User } from './types/user';
import { OffersList } from './components/OffersList';
import { CandidateProfileForm } from './components/CandidateProfileForm';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { RecruiterProfileForm } from './components/RecruiterProfileForm';
import { OfferForm } from './components/OfferForm';
import { RegisterCandidate } from './components/RegisterCandidate';

// Protected Route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Candidate Dashboard component
const CandidateDashboard: React.FC = () => <CandidateHome />;

// Recruiter Dashboard component
// const RecruiterDashboard: React.FC = () => {
//   return (
//     <div>
//       <h1>Recruiter Dashboard</h1>
//       <CandidateList />
//     </div>
//   );
// };

// Default Route component
const DefaultRoute: React.FC = () => {
  const { user } = useAuth();
  return user?.role === UserRole.CANDIDATE 
    ? <Navigate to="/candidate" /> 
    : <Navigate to="/recruiter" />;
};

// Stub components for recruiter features
const ReviewCandidates: React.FC = () => (
  <div style={{ marginTop: 64, textAlign: 'center' }}>
    <h2>Review Candidates</h2>
    <p>List of new candidate profiles will appear here.</p>
  </div>
);
const ListOffers: React.FC = () => (
  <div style={{ marginTop: 64, textAlign: 'center' }}>
    <h2>List Offers</h2>
    <p>All offers and their applicants will appear here.</p>
  </div>
);
const AddOffer: React.FC = () => (
  <div style={{ marginTop: 64, textAlign: 'center' }}>
    <h2>Add Offer</h2>
    <p>Offer creation form will appear here.</p>
  </div>
);

const ProfileRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === UserRole.CANDIDATE ? <CandidateProfileForm /> : <RecruiterProfileForm />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/candidate" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDATE]}>
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/review-candidates" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
                <CandidateList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/offers" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
                <OffersList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/add-offer" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
                <OfferForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter/register-candidate" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
                <RegisterCandidate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/offers" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.CANDIDATE]}>
                <OffersList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileRoute />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route - redirects based on role */}
          <Route path="/" element={<DefaultRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
