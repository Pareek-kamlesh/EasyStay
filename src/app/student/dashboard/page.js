"use client";

import { useState, useEffect } from "react";
import "../../styles/studentDashboard.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function StudentDashboard() {
  const [hostel, setHostel] = useState(null);
  const [notices, setNotices] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledHostel = async () => {
      try {
        const res = await fetch("/api/student/enrollment", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch enrolled hostel details");
        }
        const data = await res.json();
        if (!data.hostel) {
          alert("You need to enroll in a hostel to access the Student Dashboard.");
          router.push("/home"); // Redirect to enrollment page
        } else {
          setHostel(data.hostel); // Set the enrolled hostel details
        }
      } catch (error) {
        console.error("Error fetching hostel:", error);
      }
    };

    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch notices");
        }

        const data = await res.json();
        setNotices(data || []); // Fallback to an empty array if no data
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]); // Set an empty array if the request fails
      }
    };

    fetchEnrolledHostel();
    fetchNotices();
  }, []);

  const handleRaiseComplaint = async () => {
    if (!hostel) {
      alert("You must be enrolled in a hostel to raise a complaint.");
      return;
    }

    try {
      const res = await fetch("/api/student/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          description: complaint,
          hostelId: hostel._id, // Explicitly send the hostel ID
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to raise complaint");
      }

      alert("Complaint raised successfully!");
      setComplaint("");
    } catch (error) {
      console.error("Error raising complaint:", error);
      alert("Error raising complaint. Please try again.");
    }
  };

  const handleUnenroll = async () => {
    try {
      const res = await fetch("/api/student/unenroll", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      console.log("Unenroll API Response:", res.status, result);

      if (!res.ok) {
        alert(result.message || "Failed to unenroll");
        throw new Error(result.message || "Failed to unenroll");
      }

      alert("You have successfully unenrolled from the hostel.");
      setHostel(null);
    } catch (error) {
      console.error("Error during unenrollment:", error);
      alert(error.message || "An error occurred while unenrolling.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="student-dashboard-container">
        <h1 className="dashboard-title">Student Dashboard</h1>

        {/* Hostel Details Section */}
        <div className="section">
          <h2 className="section-title">Enrolled Hostel</h2>
          {hostel ? (
            <div className="hostel-details">
              <p>
                <strong>Name:</strong> {hostel.name}
              </p>
              <p>
                <strong>Address:</strong> {hostel.address}
              </p>
              <p>
                <strong>Amenities:</strong> {hostel.amenities.join(", ")}
              </p>

              {/* Photos Section */}
              <div className="hostel-photos">
                <h3>Photos:</h3>
                <div className="photos-grid">
                  {hostel.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="hostel-photo"
                    />
                  ))}
                </div>
              </div>

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
                  <p>
                    <strong>{notice.title}</strong>
                  </p>
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
            <button className="payment-button">Make Payment</button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
