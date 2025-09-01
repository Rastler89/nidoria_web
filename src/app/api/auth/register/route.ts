import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()

    // Simulate API validation - replace with your NestJS API call
    // Mock successful registration
    const mockResponse = {
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: Date.now().toString(),
        email: email,
        username: username,
      },
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
