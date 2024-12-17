'use client';

import { useState, useEffect } from 'react';
import '../styles/guardDashboard.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function GuardDashboard() {
  const [hostel, setHostel] = useState(null);
  const [students, setStudents] = useState([]);
  const [shiftDetails, setShiftDetails] = useState('');

  useEffect(() => {
    const fetchGuardDetails = async () => {
      try {
        const res = await fetch('/api/guard/details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch guard details');
        }
        const data = await res.json();
        setHostel(data.hostel);
        setStudents(data.students);
        setShiftDetails(data.shiftDetails);
      } catch (error) {
        console.error('Error fetching guard details:', error);
      }
    };

    fetchGuardDetails();
  }, []);

  const markAttendance = async (studentId, type) => {
    try {
      const res = await fetch('/api/guard/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId, type }),
      });
      if (!res.ok) {
        throw new Error('Failed to mark attendance');
      }
      alert(`${type} marked successfully for student.`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance.');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['guard']}>
    <div className="guard-dashboard-container">
      <h1 className="dashboard-title">Guard Dashboard</h1>

      {/* Shift Details */}
      <div className="section">
        <h2 className="section-title">Shift Details</h2>
        {shiftDetails ? (
          <p className="shift-details">{shiftDetails}</p>
        ) : (
          <p>No shift details available.</p>
        )}
      </div>

      {/* Hostel Details */}
      <div className="section">
        <h2 className="section-title">Assigned Hostel</h2>
        {hostel ? (
          <div className="hostel-details">
            <p><strong>Name:</strong> {hostel.name}</p>
            <p><strong>Address:</strong> {hostel.address}</p>
          </div>
        ) : (
          <p>No hostel assigned yet.</p>
        )}
      </div>

      {/* Student List */}
      <div className="section">
        <h2 className="section-title">Students</h2>
        {students.length > 0 ? (
          <ul className="student-list">
            {students.map((student) => (
              <li key={student._id} className="student-item">
                <p>{student.name}</p>
                <button
                  onClick={() => markAttendance(student._id, 'in-time')}
                  className="attendance-button in-time"
                >
                  Mark In-Time
                </button>
                <button
                  onClick={() => markAttendance(student._id, 'out-time')}
                  className="attendance-button out-time"
                >
                  Mark Out-Time
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No students found in the assigned hostel.</p>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
