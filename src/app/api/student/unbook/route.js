import dbConnect from '../../../lib/dbConnect';
import User from '../../../../models/User';
import Hostel from '../../../../models/Hostel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await dbConnect();

      const user = await User.findById(decoded.id);
      if (!user || !user.enrolledHostel) {
        return res.status(400).json({ message: 'You are not enrolled in any hostel.' });
      }

      const hostel = await Hostel.findById(user.enrolledHostel);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found.' });
      }

      user.enrolledHostel = null;
      await user.save();

      res.status(200).json({ message: 'Unbooked successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
