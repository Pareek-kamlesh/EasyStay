import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Hostel from '../../../models/Hostel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { hostelId, roomType } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await dbConnect();

      const user = await User.findById(decoded.id);
      const hostel = await Hostel.findById(hostelId);

      if (!user || !hostel) {
        return res.status(404).json({ message: 'Invalid user or hostel' });
      }

      if (user.enrolledHostel) {
        return res.status(400).json({ message: 'User is already enrolled in a hostel' });
      }

      const room = hostel.rooms.find((r) => r.type === roomType && r.availability);
      if (!room) {
        return res.status(400).json({ message: 'Room not available' });
      }

      room.availability = false;
      user.enrolledHostel = hostelId;

      await user.save();
      await hostel.save();

      res.status(200).json({ message: 'Booking successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
