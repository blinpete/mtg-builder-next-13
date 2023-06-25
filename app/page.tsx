import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "@/components/User";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex-grow flex flex-col justify-center text-center">
      Welcome to
      <h1 className="text-2xl">MTG Builder</h1>
      <h2>You are logged as:</h2>
      <p>SSR session info:</p>
      <pre>{JSON.stringify(session)}</pre>
      <p>Client side rendered session info:</p>
      <User />
      <br />
      <a
        href="/auth/protected"
        className="text-blue-400 hover:opacity-50 transition"
      >
        Auth protected page
      </a>
    </div>
  );
}
