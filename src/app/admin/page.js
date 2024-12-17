"use client";

import { useState, useEffect } from "react";
import "../styles/adminDashboard.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminDashboard() {
  const router = useRouter();
  const [hostels, setHostels] = useState([]);
  const [hostelForm, setHostelForm] = useState({
    name: "",
    address: "",
    amenities: "",
    rooms: [{ type: "", rent: 0, availability: 0 }], // Default availability is 0
    owner: { name: "", contact: "" },
    photos: [],
  });
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Track if updating a hostel
  const [updateHostelId, setUpdateHostelId] = useState(""); // ID of hostel being updated

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
          photos: data.urls, // Replace previous photos with new ones
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

  // Handle adding or updating a hostel
  const handleHostelSubmit = async (e) => {
    e.preventDefault();

    // Validate room data
    for (const room of hostelForm.rooms) {
      if (!room.type || room.rent <= 0 || room.availability < 0) {
        alert("Please fill in valid room details (positive rent and availability).");
        return;
      }
    }

    const endpoint = isUpdating ? `/api/hostels/${updateHostelId}` : "/api/hostels";
    const method = isUpdating ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...hostelForm,
          amenities: hostelForm.amenities.split(","),
        }),
      });

      if (res.ok) {
        const updatedHostel = await res.json();
        if (isUpdating) {
          setHostels((prev) =>
            prev.map((hostel) =>
              hostel._id === updateHostelId ? updatedHostel : hostel
            )
          );
          alert("Hostel updated successfully!");
        } else {
          setHostels((prev) => [...prev, updatedHostel]);
          alert("Hostel added successfully!");
        }

        // Reset form
        setHostelForm({
          name: "",
          address: "",
          amenities: "",
          rooms: [{ type: "", rent: 0, availability: 0 }], // Reset availability to 0
          owner: { name: "", contact: "" },
          photos: [],
        });
        setIsUpdating(false);
        setUpdateHostelId("");
      } else {
        const { error } = await res.json();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred");
    }
  };

  // Handle delete hostel
  const handleDeleteHostel = async (id) => {
    if (!confirm("Are you sure you want to delete this hostel?")) return;

    try {
      const res = await fetch(`/api/hostels/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHostels((prev) => prev.filter((hostel) => hostel._id !== id));
        alert("Hostel deleted successfully!");
      } else {
        alert("Failed to delete hostel.");
      }
    } catch (error) {
      console.error("Error deleting hostel:", error);
    }
  };

  // Handle edit button click
  const handleEditHostel = (hostel) => {
    setIsUpdating(true);
    setUpdateHostelId(hostel._id);
    setHostelForm({
      name: hostel.name,
      address: hostel.address,
      amenities: hostel.amenities.join(","),
      rooms: hostel.rooms,
      owner: hostel.owner,
      photos: [], // Clear photos for new uploads
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Add or Update Hostel Form */}
      <div className="section">
        <h2>{isUpdating ? "Update Hostel" : "Add New Hostel"}</h2>
        <form onSubmit={handleHostelSubmit} className="hostel-form">
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
              <input
                type="number"
                placeholder="Availability"
                value={room.availability}
                onChange={(e) => {
                  const updatedRooms = [...hostelForm.rooms];
                  updatedRooms[index].availability = Math.max(0, Number(e.target.value)); // Ensure availability is non-negative
                  setHostelForm({ ...hostelForm, rooms: updatedRooms });
                }}
                required
              />
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
              const newRoom = { type: "", rent: 0, availability: 0 };
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
          <button type="submit">{isUpdating ? "Update Hostel" : "Add Hostel"}</button>
        </form>
      </div>

      {/* Hostels List */}
      <div className="section">
        <h2>Manage Hostels</h2>
        <div className="hostel-cards">
          {hostels.map((hostel) => (
            <div key={hostel._id} className="hostel-card">
              <h3>{hostel.name}</h3>
              <p>{hostel.address}</p>
              <p>Amenities: {hostel.amenities.join(", ")}</p>
              <div className="action-buttons">
                <button onClick={() => handleEditHostel(hostel)} className="action-button">
                  Update
                </button>
                <button
                  onClick={() => handleDeleteHostel(hostel._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
