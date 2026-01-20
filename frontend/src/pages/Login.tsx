import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('admin@niufoods.cl');
  const [password, setPassword] = useState('admin123');
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded"
            placeholder="Password"
            disabled={isLoading}
          />
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
