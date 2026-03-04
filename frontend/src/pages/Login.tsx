import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-red-600 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="bg-black rounded p-4 mb-4 inline-block">
            <span className="text-white font-bold text-2xl">NIU FOODS</span>
          </div>
          <h1 className="text-white text-xl font-bold">INICIAR SESION</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded"
            placeholder="Email"
            disabled={isLoading}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded pr-10"
              placeholder="Password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-red-600 p-3 rounded font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'INICIAR SESION'}
          </button>
        </form>
      </div>
    </div>
  );
}
