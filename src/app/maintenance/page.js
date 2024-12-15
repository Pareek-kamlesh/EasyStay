'use client';

import { useState, useEffect } from 'react';
import '../styles/maintenanceDashboard.css';

export default function MaintenanceDashboard() {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticeContent, setNoticeContent] = useState('');

  useEffect(() => {
    const fetchAssignedHostels = async () => {
      try {
        const res = await fetch('/api/maintenance/hostels', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch hostels');
        }
        const data = await res.json();
        setHostels(data);
        if (data.length > 0) setSelectedHostel(data[0]._id); // Default to first hostel
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchAssignedHostels();
  }, []);

  useEffect(() => {
    if (selectedHostel) {
      const fetchComplaints = async () => {
        try {
          const res = await fetch(`/api/maintenance/complaints/${selectedHostel}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!res.ok) {
            throw new Error('Failed to fetch complaints');
          }
          const data = await res.json();
          setComplaints(data);
        } catch (error) {
          console.error('Error fetching complaints:', error);
        }
      };

      fetchComplaints();
    }
  }, [selectedHostel]);

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const res = await fetch(`/api/maintenance/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error('Failed to update complaint status');
      }
      alert('Complaint status updated successfully!');
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, status } : complaint
        )
      );
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handlePostNotice = async () => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: noticeContent,
          hostelId: selectedHostel,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to post notice');
      }
      alert('Notice posted successfully!');
      setNoticeContent('');
    } catch (error) {
      console.error('Error posting notice:', error);
    }
  };

  return (
    <div className="maintenance-dashboard-container">
      <h1 className="dashboard-title">Maintenance Dashboard</h1>

      {/* Select Hostel */}
      <div className="section">
        <h2 className="section-title">Select Hostel</h2>
        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          className="hostel-select"
        >
          {hostels.map((hostel) => (
            <option key={hostel._id} value={hostel._id}>
              {hostel.name}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints Section */}
      <div className="section">
        <h2 className="section-title">Complaints</h2>
        {complaints.length > 0 ? (
          <ul className="complaint-list">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="complaint-item">
                <p>{complaint.description}</p>
                <p>
                  <strong>Status:</strong> {complaint.status}
                </p>
                <button
                  onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                  className="resolve-button"
                >
                  Mark as Resolved
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No complaints for this hostel.</p>
        )}
      </div>

      {/* Post Notice Section */}
      <div className="section">
        <h2 className="section-title">Post a Notice</h2>
        <textarea
          value={noticeContent}
          onChange={(e) => setNoticeContent(e.target.value)}
          placeholder="Write a notice..."
          className="notice-input"
        ></textarea>
        <button onClick={handlePostNotice} className="post-button">
          Post Notice
        </button>
      </div>
    </div>
  );
}
