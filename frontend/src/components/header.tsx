import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">NIU</span>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">NIU FOODS</h1>
                <p className="text-red-200 text-sm">Sistema de Locales</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              MIS LOCALES
            </Link>
            
            <button
              onClick={() => navigate('/visitas')}
              className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              INGRESAR VISITAS
            </button>
            
            <button
              onClick={() => navigate('/informes')}
              className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              INFORMES
            </button>

            {isAdmin && (
              <Link
                to="/dashboard"
                className="text-yellow-300 hover:text-yellow-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                PANEL DE CONTROL
              </Link>
            )}
            
            {!isAdmin && (
              <Link
                to="/dashboard"
                className="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                MI PANEL
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              <p className="font-medium">{user?.nombre} {user?.apellido}</p>
              <p className="text-red-200">{user?.email}</p>
            </div>
            
            <div className="relative group">
              <button className="bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">MI PERFIL</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden bg-red-700 border-t border-red-500">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 transition-colors"
          >
            MIS LOCALES
          </Link>
          
          <button
            onClick={() => navigate('/visitas')}
            className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 transition-colors"
          >
            INGRESAR VISITAS
          </button>
          
          <button
            onClick={() => navigate('/informes')}
            className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 transition-colors"
          >
            INFORMES
          </button>

          {isAdmin && (
            <Link
              to="/dashboard"
              className="text-yellow-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 transition-colors"
            >
              PANEL DE CONTROL
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}