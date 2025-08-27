import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';

// Layout Components
import SimpleLayout from './components/layout/SimpleLayout';
import AuthLayout from './components/layout/AuthLayout';
import ModernLayout from './components/layout/ModernLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Main App Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyNew from './pages/PropertyNew';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Media from './pages/Media';
import Amenities from './pages/Amenities';
import Analytics from './pages/Analytics';
import Content from './pages/Content';
import Users from './pages/Users';

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

              {/* Admin/Staff Routes with Modern Layout */}
              <Route path="/" element={<ModernLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="properties/new" element={<PropertyNew />} />
                <Route path="properties" element={<Properties />} />
                <Route path="leads" element={<Leads />} />
                <Route path="media" element={<Media />} />
                <Route path="amenities" element={<Amenities />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="content" element={<Content />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Public Routes (will be added later for property listings) */}
              <Route path="/public" element={<SimpleLayout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </I18nProvider>
    </ApolloProvider>
  );
}
export default App;
