import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';

// Layout Components
import SimpleLayout from './components/layout/SimpleLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Main App Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <I18nProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="accept-invite" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route index element={<Navigate to="/auth/login" replace />} />
              </Route>

              {/* Main App Routes */}
              <Route path="/" element={<SimpleLayout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </I18nProvider>
    </ApolloProvider>
  );
}
export default App;
