import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const dbHost = process.env.DB_HOST;

    if (!dbHost) {
      console.error("DB_HOST is not defined in environment variables");
      // Fallback or error
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const res = await fetch(`${dbHost}/pre-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      let errorData = { message: "Failed to pre-register" };
      try {
        errorData = await res.json();
      } catch (e) {
        // Not JSON
      }
      return NextResponse.json({ error: errorData.message || "Backend error" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Pre-registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
