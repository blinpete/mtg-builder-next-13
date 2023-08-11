import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"
import type { JWTDecodeParams } from "next-auth/jwt"

function decodeJWT(token: JWTDecodeParams["token"]) {
  return decode({ token: token, secret: "" + process.env.SECRET })
}

/**
 * Get decoded JWT from NextAuth cookies
 */
export async function getDecodedJWT() {
  const cookieStore = cookies()
  const token = cookieStore.get("next-auth.session-token")
  console.log("🚀 | getDecodedJWT | token:", token)

  const decoded = await decodeJWT(token?.value)

  return decoded
}
