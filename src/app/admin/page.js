"use client";

import { useState, useEffect } from "react";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [hostels, setHostels] = useState([]);
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [hostelForm, setHostelForm] = useState({
    name: "",
    address: "",
    amenities: "",
    rooms: [{ type: "", rent: 0, availability: true }],
    owner: { name: "", contact: "" },
    photos: [],
  });
  const [uploading, setUploading] = useState(false);

  // Fetch all hostels
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch("/api/hostels");
        const data = await res.json();
        setHostels(data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    fetchHostels();
  }, []);

  // Fetch all notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices");
        const data = await res.json();
        setNotices(data.notices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  // Handle Photo Upload using Cloudinary
  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setHostelForm((prev) => ({
          ...prev,
          photos: [...prev.photos, ...data.urls], // Append uploaded photo URLs
        }));
      } else {
        console.error("Photo upload failed:", data.error);
      }
    } catch (err) {
      console.error("Error uploading photos:", err);
    } finally {
      setUploading(false);
    }
  };

  // Handle adding a new hostel
  const handleAddHostel = async (e) => {
    e.preventDefault();

    // Validate room data
    for (const room of hostelForm.rooms) {
      if (!room.type || room.rent <= 0) {
        alert("Please fill in valid room details.");
        return;
      }
    }

    try {
      const res = await fetch("/api/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hostelForm.name,
          address: hostelForm.address,
          amenities: hostelForm.amenities.split(","),
          rooms: hostelForm.rooms,
          owner: hostelForm.owner,
          photos: hostelForm.photos, // Ensure Cloudinary URLs are valid
        }),
      });

      if (res.ok) {
        const newHostel = await res.json();
        alert("Hostel added successfully!");
        setHostels((prev) => [...prev, newHostel]);
        setHostelForm({
          name: "",
          address: "",
          amenities: "",
          rooms: [{ type: "", rent: 0, availability: true }],
          owner: { name: "", contact: "" },
          photos: [],
        });
      } else {
        const { error } = await res.json();
        alert(`Error adding hostel: ${error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred");
    }
  };

  // Handle creating a new notice
  const handleCreateNotice = async () => {
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newNotice, createdBy: "admin_id" }), // Replace 'admin_id' dynamically
      });

      if (!res.ok) {
        throw new Error("Failed to create notice");
      }

      const notice = await res.json();
      setNotices((prev) => [notice, ...prev]);
      setNewNotice({ title: "", content: "" });
      alert("Notice created successfully!");
    } catch (error) {
      console.error("Error creating notice:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Add Hostel Form */}
      <div className="section">
        <h2>Add New Hostel</h2>
        <form onSubmit={handleAddHostel} className="hostel-form">
          <input
            type="text"
            placeholder="Hostel Name"
            value={hostelForm.name}
            onChange={(e) =>
              setHostelForm({ ...hostelForm, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={hostelForm.address}
            onChange={(e) =>
              setHostelForm({ ...hostelForm, address: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            value={hostelForm.amenities}
            onChange={(e) =>
              setHostelForm({ ...hostelForm, amenities: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Owner Name"
            value={hostelForm.owner.name}
            onChange={(e) =>
              setHostelForm({
                ...hostelForm,
                owner: { ...hostelForm.owner, name: e.target.value },
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Owner Contact"
            value={hostelForm.owner.contact}
            onChange={(e) =>
              setHostelForm({
                ...hostelForm,
                owner: { ...hostelForm.owner, contact: e.target.value },
              })
            }
            required
          />

          {/* Room Details Section */}
          <h3>Room Details</h3>
          {hostelForm.rooms.map((room, index) => (
            <div key={index} className="room-details">
              <input
                type="text"
                placeholder="Room Type (e.g., Single, Double)"
                value={room.type}
                onChange={(e) => {
                  const updatedRooms = [...hostelForm.rooms];
                  updatedRooms[index].type = e.target.value;
                  setHostelForm({ ...hostelForm, rooms: updatedRooms });
                }}
                required
              />
              <input
                type="number"
                placeholder="Rent (per month)"
                value={room.rent}
                onChange={(e) => {
                  const updatedRooms = [...hostelForm.rooms];
                  updatedRooms[index].rent = Number(e.target.value);
                  setHostelForm({ ...hostelForm, rooms: updatedRooms });
                }}
                required
              />
              <label>
                Availability:
                <select
                  value={room.availability ? "Available" : "Not Available"}
                  onChange={(e) => {
                    const updatedRooms = [...hostelForm.rooms];
                    updatedRooms[index].availability =
                      e.target.value === "Available";
                    setHostelForm({ ...hostelForm, rooms: updatedRooms });
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  const updatedRooms = hostelForm.rooms.filter(
                    (_, i) => i !== index
                  );
                  setHostelForm({ ...hostelForm, rooms: updatedRooms });
                }}
                className="remove-room-button"
              >
                Remove Room
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newRoom = { type: "", rent: 0, availability: true };
              setHostelForm({
                ...hostelForm,
                rooms: [...hostelForm.rooms, newRoom],
              });
            }}
            className="add-room-button"
          >
            Add Room
          </button>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          {uploading && <p>Uploading photos...</p>}
          <button type="submit">Add Hostel</button>
        </form>
      </div>

      {/* Other Sections (Notices, List of Hostels) */}
      {/* Same as original */}
    </div>
  );
}
