'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/hostelDetails.css';

export default function HostelDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const res = await fetch(`/api/hostels/${id}`);
        console.log('API Response:', res); // Log the response
        if (!res.ok) {
          throw new Error(`Failed to fetch hostel details: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Hostel Data:', data); // Log the fetched data
        setHostel(data);
      } catch (error) {
        console.error('Error fetching hostel details:', error);
      }
    };
  
    fetchHostelDetails();
  }, [id]);
  

  const handleBooking = async (roomType) => {
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ hostelId: id, roomType }),
      });

      if (!res.ok) {
        throw new Error('Failed to book the room');
      }

      alert('Booking successful! Redirecting to dashboard...');
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Error booking room:', error);
      alert('An error occurred while booking the room.');
    }
  };

  if (!hostel) {
    return <p className="loading">Loading hostel details...</p>;
  }

  return (
    <div className="hostel-details-container">
      <h1 className="hostel-title">{hostel.name}</h1>
      <p className="hostel-address">{hostel.address}</p>
      <p className="hostel-amenities">Amenities: {hostel.amenities.join(', ')}</p>

      <div className="hostel-photos">
        {hostel.photos.map((photo, idx) => (
          <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="photo" />
        ))}
      </div>

      <h2 className="room-section-title">Available Rooms</h2>
      <div className="rooms-list">
        {hostel.rooms.map((room, idx) => (
          <div key={idx} className="room-card">
            <h3>{room.type}</h3>
            <p>Rent: ₹{room.rent}/month</p>
            <p>Availability: {room.availability ? 'Available' : 'Not Available'}</p>
            {room.availability && (
              <button onClick={() => handleBooking(room.type)} className="book-button">
                Book Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
