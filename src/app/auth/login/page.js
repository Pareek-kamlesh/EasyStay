'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

export default function LoginPage() {
  const { auth, login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isAuthenticated) {
      switch (auth.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'admin':
          router.push('/admin');
          break;
        case 'guard':
          router.push('/guard');
          break;
        case 'maintenance':
          router.push('/maintenance');
          break;
        default:
          router.push('/');
      }
    }
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Save the token and role in AuthContext
      login(data.token, data.role);

      // Redirect based on the user's role
      switch (data.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'admin':
          router.push('/admin');
          break;
        case 'guard':
          router.push('/guard');
          break;
        case 'maintenance':
          router.push('/maintenance');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
