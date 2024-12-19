"use client";

import { useState, useEffect } from "react";
import "../styles/maintenanceDashboard.css";
import ProtectedRoute from "../components/ProtectedRoute";

export default function MaintenanceDashboard() {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [noticeContent, setNoticeContent] = useState("");

  useEffect(() => {
    const fetchAssignedHostels = async () => {
      try {
        const res = await fetch("/api/maintenance/hostels", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch hostels");
        }

        const data = await res.json();
        setHostels(data);
        if (data.length > 0) setSelectedHostel(data[0]._id); // Default to first hostel
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    fetchAssignedHostels();
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!selectedHostel) return;

      try {
        const res = await fetch(`/api/maintenance/complaints?hostelId=${selectedHostel}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [selectedHostel]);

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const res = await fetch(`/api/maintenance/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update complaint status");
      }

      alert("Complaint status updated successfully!");
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, status } : complaint
        )
      );
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const handlePostNotice = async () => {
    if (!selectedHostel) {
      alert("Please select a hostel before posting a notice.");
      return;
    }
  
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: "New Notice", // Example title, replace with dynamic input if needed
          content: noticeContent,
          hostelId: selectedHostel, // Link notice to the selected hostel
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to post notice");
      }
  
      alert("Notice posted successfully!");
      setNoticeContent(""); // Clear the input field
    } catch (error) {
      console.error("Error posting notice:", error);
      alert("Error posting notice. Please try again.");
    }
  };
  
  

  return (
    <ProtectedRoute allowedRoles={["maintenance"]}>
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
                    onClick={() => handleStatusUpdate(complaint._id, "Resolved")}
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
    </ProtectedRoute>
  );
}
