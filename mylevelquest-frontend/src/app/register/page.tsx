'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {}, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch('http://localhost:5163/api/auth/register', { // API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        router.push('/login');
        alert('Registration successful! Heading back to log in.');
      } else {
        const error = await response.text();
        console.error('Registration failed:', error);
        setError(error || 'Registration failed, please try again.');
      }
    } catch (error: any) {
      console.error('Something went wrong:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Sign Up As A Hero</h2>
        {/* 🔴 Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. PlanetSavior123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300"
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
            className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-purple-600 hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}