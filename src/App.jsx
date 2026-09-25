import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HotelProvider } from './context/HotelContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import RoomList from './pages/RoomList';
import RoomDetails from './pages/RoomDetails';
import BookingsList from './pages/BookingsList';
import GuestList from './pages/GuestList';
import GuestProfile from './pages/GuestProfile';
import Analytics from './pages/Analytics';
import DiningServices from './pages/DiningServices';
import SystemSettings from './pages/SystemSettings';
import Payments from './pages/Payments';

import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <Router>
          <Routes>
            {/* Public Routes (Only accessible when logged out) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes (Requires Authentication) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Room Management Routes */}
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id"
              element={
                <ProtectedRoute>
                  <RoomDetails />
                </ProtectedRoute>
              }
            />

            {/* Bookings & Reservations Routes */}
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsList />
                </ProtectedRoute>
              }
            />

            {/* Guest Management Routes */}
            <Route
              path="/guests"
              element={
                <ProtectedRoute>
                  <GuestList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guests/:id"
              element={
                <ProtectedRoute>
                  <GuestProfile />
                </ProtectedRoute>
              }
            />

            {/* Analytics & Reports Routes */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            {/* Dining & Room Services Routes */}
            <Route
              path="/dining"
              element={
                <ProtectedRoute>
                  <DiningServices />
                </ProtectedRoute>
              }
            />

            {/* Payments & Invoicing Routes */}
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />

            {/* System Settings Routes */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SystemSettings />
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Global Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </HotelProvider>
    </AuthProvider>
  );
}

export default App;
