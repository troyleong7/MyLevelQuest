'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5163/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.token);
        router.push('/dashboard'); 
      } else {
        const error = await response.json();
        alert(error.message || 'Login failed');
      }
    } catch (error) {
      alert('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-700 to-green-950">
      <div className="w-full max-w-md rounded-2xl bg-yellow-100 p-8 shadow-lg">
          <div className="flex justify-center mb-4">
          <img
            src="/MLQ-logo.png" 
            alt="MyLevelQuest Logo"
            className="h-60 w-60 object-contain"
          />
        </div>
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-700">Welcome Back Hero ⚔️</h2>
        <p className="mb-8 text-center text-sm text-green-950">
          Log in to continue your quest!
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-yellow-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-green-950 placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-yellow-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 shadow-sm text-green-950 placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white transition hover:bg-yellow-900"
          >
            Enter the Tavern
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-950">
          Don’t have an account?{' '}
          <a href="/register" className="font-medium text-yellow-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}