import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const user = verifyToken(token);
  return user || null;
}
