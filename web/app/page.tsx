'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('erpdemo@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('LOGIN RESPONSE =>', res.data);

      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        router.push('/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('LOGIN ERROR =>', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">ERP Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-4 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg px-4 py-2"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </div>
    </main>
  );
}