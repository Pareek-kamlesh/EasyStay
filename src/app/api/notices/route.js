import dbConnect from "@/lib/dbConnect";
import Notice from "@/models/Notice";
import User from "@/models/User"; // Import the User model
import { verifyToken } from "@/utils/authMiddleware";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user || user.role !== "maintenance") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { title, content, hostelId } = await req.json();

    if (!title || !content || !hostelId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title, content, or hostelId" }),
        { status: 400 }
      );
    }

    await dbConnect();

    // Create a new notice
    const newNotice = await Notice.create({
      title,
      content,
      hostelId,
      postedBy: user.id, // The maintainer posting the notice
    });

    return new Response(JSON.stringify(newNotice), { status: 201 });
  } catch (error) {
    console.error("Error posting notice:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user || user.role !== "student") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    // Fetch the enrolled hostel for the student
    const student = await User.findById(user.id).populate("enrolledHostel"); // Ensure User is imported
    if (!student || !student.enrolledHostel) {
      return new Response(JSON.stringify({ error: "No enrolled hostel found" }), { status: 404 });
    }

    // Fetch notices for the student's enrolled hostel
    const notices = await Notice.find({ hostelId: student.enrolledHostel._id });

    return new Response(JSON.stringify(notices), { status: 200 });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
