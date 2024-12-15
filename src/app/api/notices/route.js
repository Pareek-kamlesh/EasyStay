import dbConnect from '@/lib/dbConnect';
import Notice from '@/models/Notice';

export async function POST(req) {
  try {
    await dbConnect();
    const { title, content, createdBy } = await req.json();

    const newNotice = await Notice.create({
      title,
      content,
      createdBy,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(newNotice), { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function GET() {
    try {
      await dbConnect();
      const notices = await Notice.find({}).sort({ createdAt: -1 });
  
      return new Response(JSON.stringify({ notices }), { status: 200 });
    } catch (error) {
      console.error('Error fetching notices:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  }
  
