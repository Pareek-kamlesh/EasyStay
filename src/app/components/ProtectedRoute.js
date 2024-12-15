'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (!token || userRole !== role) {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, role]);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return children;
}
