import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const res = await apiFetch("missions", {
    headers: { Authorization: `Bearer ${token ?? ""}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
