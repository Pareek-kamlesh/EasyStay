import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error in register API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
