import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import { verifyToken } from "@/utils/authMiddleware";

export async function POST(req) {
  try {
    const { description, hostelId } = await req.json();

    // Verify student token
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user || user.role !== "student") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();

    // Create and save the complaint
    const newComplaint = await Complaint.create({
      studentId: user.id,
      hostelId,
      description,
      status: "Pending",
    });

    return new Response(
      JSON.stringify({ message: "Complaint raised successfully!", newComplaint }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error raising complaint:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
