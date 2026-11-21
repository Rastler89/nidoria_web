import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const { resource } = await req.json();

  const res = await apiFetch("mission/cancel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resource }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
