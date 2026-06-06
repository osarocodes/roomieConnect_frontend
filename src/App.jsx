/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupContainer from './pages/auth/SignupContainer';
import LoginContainer from './pages/auth/Login';
import EmailCollection from './pages/auth/PasswordResetRequest';
import Verification from './pages/auth/VerifyPasswordResetCode';
import PasswordChange from './pages/auth/SetNewPassword';
import SuccessPage from './pages/auth/SignUpSuccessPage';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";
import RoommieFinder from './pages/RoommieFinder';
import TopMatchPage from './pages/matches/TopMatchPage';
import ReviewReport from './pages/admin/ReviewReport';
import MainLayout from './layouts/MainLayout';
import MatchSuggestionPage from './pages/matches/MatchSuggestionPage';
import ProfilePage from './pages/matches/ProfilePage';
import MessagingPage from './pages/matches/MessagingPage';
import MatchDetailsPage from './pages/matches/MatchDetailsPage';
import MessagePanel from './components/chatComponent/Messagepanel';
import NotFoundPage from './pages/404-page';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
// import { useMatchStore } from './stores/useMatchStore';

function App() {
  const { authUser, checkAuth, isCheckingAuth, admin, checkAdmin, isCheckingAdmin } = useAuthStore();
  const { theme } = useThemeStore();


  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      checkAdmin();
    }
  }, [authUser]);
  console.log("Admin status:", admin);

  // Show a loader while we are validating auth or waiting for the admin check to resolve.
  // `admin` starts as `null`, so without this check the routes can redirect before we know the user is an admin.
  const isLoadingAdmin = authUser && admin === null;
  if ((isCheckingAuth && !authUser) || isCheckingAdmin || isLoadingAdmin) return (
    <div className='flex items-center justify-center min-h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  );

  return (
    <div className="bg-base-200 text-base-content" data-theme={theme}>
      <Router>
        <Routes>
          {/* 1. Public / Entry Logic */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          
          {/* 2. Auth Flow (Nested) */}
          <Route path="/auth" element={<AuthLayout Boris />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={authUser ? <Navigate to="/roommie-finder" replace /> : <LoginContainer />} />
            <Route path="signup" element={<SignupContainer />} />
            <Route path="forgot-password" element={<EmailCollection />} />
            <Route path="verify-code" element={<Verification />} />
            <Route path="reset-password" element={<PasswordChange />} />
            <Route path="success" element={<SuccessPage />} />
          </Route>

          {/* 3. Protected Main App Routes */}
          <Route path="/roommie-finder" element={authUser ? <RoommieFinder /> : <Navigate to="/auth/login" replace />} />
          <Route path="/chat/:conversationId" element={authUser ? <MessagePanel /> : <Navigate to="/auth/login" replace />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={authUser ? <TopMatchPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/matches" element={authUser ? <MatchSuggestionPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/chat" element={authUser ? <MessagingPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/match-details/:id" element={authUser ? <MatchDetailsPage /> : <Navigate to="/auth/login" replace />} /> 
          </Route>

          {/* 4. Admin Routes (parent-level guard) */}
          <Route path="/admin" element={admin ? <AdminLayout /> : <Navigate to="/auth/login" replace />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-management" element={<Users />} />
            <Route path="review-report" element={<ReviewReport />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 5. Catch-all (404) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;