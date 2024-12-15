import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, hostelId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    user.enrolledHostel = hostelId;
    await user.save();

    return new Response(JSON.stringify({ message: 'Enrolled successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error enrolling student:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
export async function DELETE(req) {
    try {
      await dbConnect();
      const { userId } = await req.json();
  
      const user = await User.findById(userId);
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
        });
      }
  
      user.enrolledHostel = null;
      await user.save();
  
      return new Response(JSON.stringify({ message: 'Unenrolled successfully' }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error unenrolling student:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  }
  
