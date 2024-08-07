import { getToken } from "next-auth/jwt"

import type { NextRequest } from "next/server"

/**
 * Get decoded JWT from NextAuth cookies
 */
export function getDecodedJWT(req: NextRequest) {
  return getToken({ req, secret: "" + process.env.SECRET })
}
