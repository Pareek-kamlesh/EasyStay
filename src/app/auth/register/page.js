'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import '../../styles/register.css';

export default function RegisterPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // Default role
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
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
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="guard">Guard</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
