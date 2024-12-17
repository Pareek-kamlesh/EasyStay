import dbConnect from '@/lib/dbConnect';
import Hostel from '@/models/Hostel';

export async function GET() {
  try {
    await dbConnect();
    const hostels = await Hostel.find({});
    return new Response(JSON.stringify(hostels), { status: 200 });
  } catch (error) {
    console.error('Error fetching hostels:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch hostels' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { name, address, amenities, rooms, owner, photos } = await req.json();

    // Log the incoming request
    console.log("Incoming Hostel Data:", { name, address, amenities, rooms, owner, photos });

    // Input validation
    if (!name || !address || !Array.isArray(amenities) || !Array.isArray(rooms) || !Array.isArray(photos)) {
      console.error("Validation Error: Missing or incorrect fields");
      return new Response(JSON.stringify({ error: "Validation Error: Missing or incorrect fields" }), {
        status: 400,
      });
    }

    // Validate each room
    for (const room of rooms) {
      if (!room.type || typeof room.rent !== "number" || typeof room.availability !== "number") {
        console.error("Validation Error: Room data is invalid");
        return new Response(JSON.stringify({ error: "Validation Error: Room data is invalid" }), {
          status: 400,
        });
      }
    }
    

    // Create a new hostel
    const newHostel = await Hostel.create({
      name,
      address,
      amenities,
      rooms,
      owner,
      photos,
    });

    return new Response(JSON.stringify(newHostel), { status: 201 });
  } catch (error) {
    console.error("Error adding hostel:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

