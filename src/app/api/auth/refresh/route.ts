import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { refresh_token } = await request.json();

        const res = await fetch("http://localhost:4000/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refresh_token }),
        });
        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
        }

        return NextResponse.json({ token: data.access_token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}