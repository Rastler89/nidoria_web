import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const token = req.headers.get("authorization")?.split(" ")[1];

    const res = await fetch("http://localhost:4000/resources", {
        headers: {
        "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data)
}