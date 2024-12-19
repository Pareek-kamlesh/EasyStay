import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import User from "@/models/User";
import { verifyToken } from "@/utils/authMiddleware";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user || user.role !== "maintenance") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    // Fetch the maintainer's assigned hostels
    const maintainer = await User.findById(user.id);
    if (!maintainer || !maintainer.hostels || maintainer.hostels.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 }); // No hostels assigned
    }

    // Fetch complaints for the assigned hostels
    const complaints = await Complaint.find({
      hostelId: { $in: maintainer.hostels }, // Match hostels assigned to the maintainer
    });

    return new Response(JSON.stringify(complaints), { status: 200 });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
