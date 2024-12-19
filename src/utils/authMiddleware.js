import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    // Replace 'your-secret-key' with your actual JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return the decoded token (contains user data)
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error("Unauthorized: Invalid token");
  }
};
