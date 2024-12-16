import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import Hostel from '../../../../models/Hostel';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized access.' }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();

    const user = await User.findById(decoded.id).populate('enrolledHostel');
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found.' }),
        { status: 404 }
      );
    }

    if (!user.enrolledHostel) {
      return new Response(
        JSON.stringify({ message: 'No enrolled hostel found.', hostel: null }),
        { status: 200 }
      );
    }

    // Fetch the enrolled hostel with room details
    const enrolledHostel = await Hostel.findById(user.enrolledHostel).lean();
    if (!enrolledHostel) {
      return new Response(
        JSON.stringify({ message: 'Hostel not found.', hostel: null }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ hostel: enrolledHostel }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Enrollment Fetch Error:', err);
    return new Response(
      JSON.stringify({ message: 'Server error.', error: err.message }),
      { status: 500 }
    );
  }
}
