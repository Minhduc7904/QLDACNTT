import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useStudentAuth, useAdminAuth } from './hooks';
import { HomePage, StudentLoginPage, AdminLoginPage, StudentRegisterPage, StudentProfilePage, DashboardPage, AuthCallbackPage, EmailVerificationResultPage } from './pages';
import { NotificationContainer } from './components';

// Protected Route Components
const StudentProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated: isStudentAuth } = useStudentAuth();

  return isStudentAuth ? <>{children}</> : <Navigate to="/student/login" replace />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated: isAdminAuth } = useAdminAuth();

  return isAdminAuth ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const GeneralProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated: isStudentAuth } = useStudentAuth();
  const { isAuthenticated: isAdminAuth } = useAdminAuth();
  const isAuthenticated = isStudentAuth || isAdminAuth;

  return isAuthenticated ? <>{children}</> : <Navigate to="/register" replace />;
};

// Component để redirect dashboard theo role
const DashboardRedirect: React.FC = () => {
  const { isAuthenticated: isStudentAuth } = useStudentAuth();
  const { isAuthenticated: isAdminAuth } = useAdminAuth();

  // Admin redirect về admin dashboard, student về student dashboard
  if (isAdminAuth) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (isStudentAuth) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Fallback (không nên xảy ra vì đã được protect)
  return <Navigate to="/register" replace />;
};

// App Component wrapped with Redux Provider
const AppContent: React.FC = () => {
  const { initialize: initializeStudent } = useStudentAuth();
  const { initialize: initializeAdmin } = useAdminAuth();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeStudent();
    initializeAdmin();
    setIsInitialized(true);
  }, []); // Empty dependency array to run only once

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Legacy login route - redirect to student login */}
          <Route path="/login" element={<Navigate to="/student/login" replace />} />

          {/* Separate login routes */}
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Register routes */}
          <Route path="/register" element={<StudentRegisterPage />} />
          <Route path="/student/register" element={<StudentRegisterPage />} />

          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/email-verification/result" element={<EmailVerificationResultPage />} />

          <Route
            path="/dashboard"
            element={
              <GeneralProtectedRoute>
                <DashboardRedirect />
              </GeneralProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <StudentProtectedRoute>
                <DashboardPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentProtectedRoute>
                <StudentProfilePage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <DashboardPage />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NotificationContainer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
