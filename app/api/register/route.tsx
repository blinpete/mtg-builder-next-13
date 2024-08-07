import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

import type { RegisterRequest } from "@shared/auth"
import { prisma } from "@shared/lib/prismadb"
import { NextErrorResponse } from "@shared/types"

export async function POST(request: RegisterRequest) {
  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return new NextErrorResponse({ error: "Missing fields" }, { status: 400 })
  }

  console.log(`user data: ${name} ${email} ${password}`)

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (exist) {
    return new NextErrorResponse({ error: "Email Already Exists" }, { status: 209 })
  }

  const hashedPassword = await bcrypt.hash(password, 10) // 10 - salt
  console.log(`hashedPassword: ${hashedPassword}`)

  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  })

  return NextResponse.json(user, { status: 201 })
}
