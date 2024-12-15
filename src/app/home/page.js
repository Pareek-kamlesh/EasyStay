'use client';

import { useState, useEffect } from 'react';
import '../styles/home.css';
import { useRouter } from 'next/navigation';

export default function Homepage() {
    const router = useRouter();
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch('/api/hostels');
        if (!res.ok) {
          throw new Error('Failed to fetch hostels');
        }
        const data = await res.json();
        setHostels(data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to EasyStay</h1>
      <div className="hostels-grid">
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <img
                src={hostel.photos[0] || '/placeholder-image.jpg'}
                alt={hostel.name}
                className="hostel-image"
              />
              <h2>{hostel.name}</h2>
              <p>{hostel.address}</p>
              <p>Amenities: {hostel.amenities.join(', ')}</p>
              <button
                className="details-button"
                onClick={() => router.push(`/hostel/${hostel._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No hostels available at the moment.</p>
        )}
      </div>
    </div>
  );
}
