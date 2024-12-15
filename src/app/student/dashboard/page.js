'use client';

import { useState, useEffect } from 'react';
import '../../styles/studentDashboard.css';

export default function StudentDashboard() {
  const [hostel, setHostel] = useState(null);
  const [notices, setNotices] = useState([]);
  const [complaint, setComplaint] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const fetchEnrolledHostel = async () => {
      try {
        const res = await fetch('/api/student/enrollment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch hostel details');
        }
        const data = await res.json();
        setHostel(data.hostel);
      } catch (error) {
        console.error('Error fetching hostel:', error);
      }
    };

    const fetchNotices = async () => {
      try {
        const res = await fetch('/api/notices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await res.json();
        setNotices(data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchEnrolledHostel();
    fetchNotices();
  }, []);

  const handleRaiseComplaint = async () => {
    try {
      const res = await fetch('/api/student/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ description: complaint }),
      });
      if (!res.ok) {
        throw new Error('Failed to raise complaint');
      }
      alert('Complaint raised successfully!');
      setComplaint('');
    } catch (error) {
      console.error('Error raising complaint:', error);
    }
  };

  const handleUnenroll = async () => {
    try {
      const res = await fetch('/api/student/unenroll', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to unenroll');
      }
      alert('You have successfully unenrolled from the hostel.');
      setHostel(null);
    } catch (error) {
      console.error('Error unenrolling:', error);
    }
  };

  return (
    <div className="student-dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>

      {/* Hostel Details Section */}
      <div className="section">
        <h2 className="section-title">Enrolled Hostel</h2>
        {hostel ? (
          <div className="hostel-details">
            <p><strong>Name:</strong> {hostel.name}</p>
            <p><strong>Address:</strong> {hostel.address}</p>
            <p><strong>Amenities:</strong> {hostel.amenities.join(', ')}</p>
            <button onClick={handleUnenroll} className="unenroll-button">
              Unenroll from Hostel
            </button>
          </div>
        ) : (
          <p>You are not enrolled in any hostel.</p>
        )}
      </div>

      {/* Notices Section */}
      <div className="section">
        <h2 className="section-title">Notices</h2>
        {notices.length > 0 ? (
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice._id} className="notice-item">
                <p><strong>{notice.title}</strong></p>
                <p>{notice.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notices available.</p>
        )}
      </div>

      {/* Raise Complaint Section */}
      <div className="section">
        <h2 className="section-title">Raise a Complaint</h2>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Describe your issue..."
          className="complaint-input"
        ></textarea>
        <button onClick={handleRaiseComplaint} className="complaint-button">
          Submit Complaint
        </button>
      </div>

      {/* Payment Section */}
      <div className="section">
        <h2 className="section-title">Payment</h2>
        {paymentStatus ? (
          <p className="payment-status">Payment Status: {paymentStatus}</p>
        ) : (
          <button className="payment-button">
            Make Payment
          </button>
        )}
      </div>
    </div>
  );
}