import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Hostel from '../../../models/Hostel';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { hostelId, roomType } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Please log in to book a room.' }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();

    const user = await User.findById(decoded.id);
    const hostel = await Hostel.findById(hostelId);

    if (!user || !hostel) {
      return new Response(
        JSON.stringify({ message: 'Invalid user or hostel.' }),
        { status: 404 }
      );
    }

    if (user.enrolledHostel) {
      return new Response(
        JSON.stringify({ message: 'You are already enrolled in a hostel.' }),
        { status: 400 }
      );
    }

    // Find an available room of the specified type
    const room = hostel.rooms.find((r) => r.type === roomType && r.availability > 0);

    if (!room) {
      return new Response(
        JSON.stringify({ message: 'Room not available.' }),
        { status: 400 }
      );
    }

    // Decrease availability by 1
    room.availability -= 1;

    // Add the student to the students array
    hostel.students.push(user._id);

    // Update the user's enrolled hostel
    user.enrolledHostel = hostelId;

    // Save changes
    await user.save();
    await hostel.save();

    return new Response(
      JSON.stringify({ message: 'Booking successful.', hostel }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Booking Error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error.', error: err.message }),
      { status: 500 }
    );
  }
}
