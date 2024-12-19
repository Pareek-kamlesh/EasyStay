import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Hostel from "@/models/Hostel"; // Ensure this is imported
import { verifyToken } from "@/utils/authMiddleware";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    console.log("Registered Models:", mongoose.models); // Log registered models

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user || user.role !== "maintenance") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    // Fetch assigned hostels for the logged-in maintainer
    const maintainer = await User.findById(user.id).populate("hostels");
    if (!maintainer) {
      return new Response(JSON.stringify({ error: "Maintainer not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(maintainer.hostels), { status: 200 });
  } catch (error) {
    console.error("Error fetching assigned hostels:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
