import dbConnect from '@/lib/dbConnect';
import Hostel from '@/models/Hostel';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // Await `params` before using

    // Validate the ID
    if (!id || id.length !== 24) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(hostel), { status: 200 });
  } catch (error) {
    console.error('Error fetching hostel by ID:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
export async function PUT(req) {
  try {
    // Extract the ID from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Hostel ID is missing.' }),
        { status: 400 } // Bad Request
      );
    }

    await dbConnect();

    // Parse the request body
    const {
      name,
      address,
      amenities,
      rooms,
      owner,
      photos, // Newly uploaded photos
    } = await req.json();

    // Validate and transform the rooms array to match RoomSchema
    const transformedRooms = rooms.map((room) => ({
      type: room.type,
      rent: room.rent,
      availability: Number(room.availability), // Ensure availability is a number
      _id: room._id, // Include existing room ID if present
    }));

    // Update the hostel in the database
    const updatedHostel = await Hostel.findByIdAndUpdate(
      id,
      {
        name,
        address,
        amenities,
        rooms: transformedRooms, // Update with transformed rooms
        owner,
        photos, // Overwrite previous photos
      },
      { new: true }
    );

    if (!updatedHostel) {
      return new Response(JSON.stringify({ error: 'Hostel not found' }), {
        status: 404, // Not Found
      });
    }

    return new Response(JSON.stringify(updatedHostel), { status: 200 }); // OK
  } catch (error) {
    console.error('Error updating hostel:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500, // Internal Server Error
    });
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract the hostel ID

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Hostel ID is missing.' }),
        { status: 400 } // Bad Request
      );
    }

    await dbConnect();

    // Find the hostel to get the students array
    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return new Response(
        JSON.stringify({ message: 'Hostel not found.' }),
        { status: 404 } // Not Found
      );
    }

    // Unenroll all students from the hostel
    const studentIds = hostel.students;

    await User.updateMany(
      { _id: { $in: studentIds } }, // Find all users in the students array
      { $set: { enrolledHostel: null } } // Unenroll them
    );

    // Delete the hostel
    await hostel.deleteOne();

    return new Response(
      JSON.stringify({ message: 'Hostel deleted successfully, and students unenrolled.' }),
      { status: 200 } // OK
    );
  } catch (err) {
    console.error('Delete Hostel Error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error.', error: err.message }),
      { status: 500 } // Internal Server Error
    );
  }
}

