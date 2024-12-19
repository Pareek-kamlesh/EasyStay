import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Hostel from "@/models/Hostel";

export async function POST(req) {
  try {
    const { maintainerEmail, hostelId } = await req.json();

    if (!maintainerEmail || !hostelId) {
      return new Response(JSON.stringify({ error: "Invalid data provided" }), {
        status: 400,
      });
    }

    await dbConnect();

    // Find the maintainer by email and ensure their role is "maintenance"
    const maintainer = await User.findOne({ email: maintainerEmail, role: "maintenance" });
    if (!maintainer) {
      return new Response(
        JSON.stringify({ error: "Maintainer not found or role mismatch" }),
        { status: 404 }
      );
    }

    // Initialize hostels field if it doesn't exist
    if (!maintainer.hostels) {
      maintainer.hostels = [];
    }

    // Assign the hostel to the maintainer's `hostels` field
    if (!maintainer.hostels.includes(hostelId)) {
      maintainer.hostels.push(hostelId);
      await maintainer.save();
    }

    // Optionally, update the Hostel model to track maintainers
    const hostel = await Hostel.findById(hostelId);
    if (hostel && (!hostel.maintainerIds || !hostel.maintainerIds.includes(maintainer._id))) {
      hostel.maintainerIds = hostel.maintainerIds || [];
      hostel.maintainerIds.push(maintainer._id);
      await hostel.save();
    }

    return new Response(
      JSON.stringify({ message: "Maintainer assigned successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning maintainer:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
