// import { getServerSession } from "next-auth"
// import User from "@/components/User"
// import { authOptions } from "./api/auth/[...nextauth]/route"

import { LayoutMain } from "@widgets/LayoutMain"

export async function HomePage() {
  // const session = await getServerSession(authOptions)

  return (
    <LayoutMain
      className="flex-grow flex flex-col justify-center text-center bg-clip-text"
      style={{
        opacity: 0.75,
        color: "transparent",
        textShadow: "rgb(236 230 230 / 50%) 2px 2px 3px",
        backgroundColor: "rgb(147 155 161)",
        fontFamily: "system-ui",
      }}
    >
      <span className="text-md font-semibold">Welcome to</span>
      <h1 className="text-4xl font-extrabold">MTG Builder</h1>
      {/* <h2>You are logged as:</h2>
      <p>SSR session info:</p>
      <pre>{JSON.stringify(session)}</pre>
      <p>Client side rendered session info:</p>
      <User />
      <br />
      <a href="/auth/protected" className="text-blue-400 hover:opacity-50 transition">
        Auth protected page
      </a> */}
    </LayoutMain>
  )
}
