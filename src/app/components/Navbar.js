'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import '../styles/navbar.css';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to the homepage after logout
  };

  return (
    <header className="navbar-container">
      <div className="navbar">
        <h1 className="logo">
          <Link href="/">EasyStay</Link>
        </h1>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          {auth.isAuthenticated ? (
            <>
              {auth.role === 'student' && <Link href="/student/dashboard">Student Dashboard</Link>}
              {auth.role === 'admin' && <Link href="/admin">Admin Dashboard</Link>}
              {auth.role === 'guard' && <Link href="/guard">Guard Dashboard</Link>}
              {auth.role === 'maintenance' && <Link href="/maintenance">Maintenance Dashboard</Link>}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
