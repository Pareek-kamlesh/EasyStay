'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or role is not allowed
    if (!auth.isAuthenticated) {
      router.push('/auth/login');
    } else if (!allowedRoles.includes(auth.role)) {
      router.push('/403'); // Forbidden page for unauthorized roles
    } else {
      setLoading(false); // Allow rendering of children
    }
  }, [auth, router, allowedRoles]);

  if (loading) {
    return <p>Loading...</p>; // Show loading state while verifying
  }

  return children;
}
