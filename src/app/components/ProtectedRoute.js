'use client';

import {useAuth} from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== role) {
      router.push('/auth/login');
    }
  }, [auth, role, router]);

  if (!auth.isAuthenticated || auth.role !== role) {
    return <p>Loading...</p>;
  }

  return children;
}
