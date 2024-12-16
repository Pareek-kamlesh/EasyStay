import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import Hostel from '../../../../models/Hostel';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Authorization token is missing.' }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();

    const user = await User.findById(decoded.id);
    if (!user || !user.enrolledHostel) {
      return new Response(
        JSON.stringify({ message: 'You are not enrolled in any hostel.' }),
        { status: 400 }
      );
    }

    const hostel = await Hostel.findById(user.enrolledHostel);

    if (!hostel) {
      return new Response(
        JSON.stringify({ message: 'Hostel not found.' }),
        { status: 404 }
      );
    }

    // Remove the student from the students array
    hostel.students = hostel.students.filter(
      (student) => student.toString() !== user._id.toString()
    );

    // Optionally, update room availability
    const bookedRoom = hostel.rooms.find((room) => room.availability >= 0); // Ensure room exists
    if (bookedRoom) {
      bookedRoom.availability += 1;
    }

    // Unlink the hostel from the user
    user.enrolledHostel = null;

    // Save changes
    await user.save();
    await hostel.save();

    return new Response(
      JSON.stringify({ message: 'Unenrolled successfully.' }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Unenroll Error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error.', error: err.message }),
      { status: 500 }
    );
  }
}
