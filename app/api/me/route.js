// Import Next.js response helper
import { NextResponse } from "next/server";

// Import JSON Web Token library
import jwt from "jsonwebtoken";

// Secret key used for signing/verifying JWT tokens
// First tries to read from environment variable (safe for production)
// If not found, defaults to "secretkey" (only for local/testing use)
const JWT_SECRET = process.env.JWT_SECRET || "Dell@123";

// API handler for GET requests
export async function GET(req) {
  try {
    // Get the token stored in cookies (named "token")
    const token = req.cookies.get("token")?.value;

    // If no token is found, return Unauthorized (401)
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify the token using the secret key
    // If valid, "decoded" will contain the user data stored in the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // If verification succeeds, return the decoded user info
    return NextResponse.json({ user: decoded });

  } catch (err) {
    // If verification fails (expired/invalid token), return Unauthorized
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
