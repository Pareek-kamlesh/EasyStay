'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/navbar.css';

export default function Navbar() {
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get the role from localStorage (if it exists)
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (token && userRole) {
      setRole(userRole);
    } else {
      setRole(''); // Ensure role is cleared if user is not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(''); // Clear the role state
    router.push('/'); // Redirect to the homepage after logout
  };

  return (
    <header className="navbar-container">
      <div className="navbar">
        <h1 className="logo">
          <Link href="/">EasyStay</Link>
        </h1>
        <nav className="nav-links">
          <Link href="/home">Home</Link>
          {/* Conditional Links Based on Role */}
          {role === 'admin' && <Link href="/admin/dashboard">Admin Dashboard</Link>}
          {role === 'student' && <Link href="/student/dashboard">Student Dashboard</Link>}
          {role === 'guard' && <Link href="/guard/dashboard">Guard Dashboard</Link>}
          {role === 'maintenance' && <Link href="/maintenance/dashboard">Maintenance Dashboard</Link>}
          {/* Show Login/Register for Unauthenticated Users */}
          {!role && <Link href="/auth/login">Login</Link>}
          {!role && <Link href="/auth/register">Register</Link>}
          {/* Show Logout for Authenticated Users */}
          {role && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
