'use client';

import './styles/welcome.css';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to EasyStay</h1>
      <p className="welcome-subtitle">
        Your one-stop solution to finding the perfect stay near your school or college.
      </p>
      <div className="button-group">
        <button
          className="primary-button"
          onClick={() => router.push('/home')}
        >
          Browse Hostels
        </button>
        <button
          className="secondary-button"
          onClick={() => router.push('/auth/login')}
        >
          Login
        </button>
      </div>
    </div>
  );
}
