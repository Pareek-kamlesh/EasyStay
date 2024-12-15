import dbConnect from '@/lib/dbConnect';
import Hostel from '@/models/Hostel';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    console.log('API received ID:', id);

    if (!id || id.length !== 24) {
      return new Response(JSON.stringify({ error: 'Invalid Hostel ID' }), { status: 400 });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(hostel), { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/hostels/[id]:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
