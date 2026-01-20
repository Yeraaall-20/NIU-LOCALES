import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LocalList from './pages/LocalList';
import LocalNew from './pages/LocalNew';
import LocalDetail from './pages/LocalDetail';
import AdminDashboard from './pages/AdminDashboard';
import Visitas from './pages/Visitas';
import Informes from './pages/Informes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><LocalList /></ProtectedRoute>} />
            <Route path="/local/new" element={<ProtectedRoute><LocalNew /></ProtectedRoute>} />
            <Route path="/local/:id" element={<ProtectedRoute><LocalDetail /></ProtectedRoute>} />
            <Route path="/local/:id/edit" element={<ProtectedRoute><LocalNew /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/visitas" element={<ProtectedRoute><Visitas /></ProtectedRoute>} />
            <Route path="/informes" element={<ProtectedRoute><Informes /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
