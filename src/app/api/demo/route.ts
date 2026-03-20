import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "templaite-demo",
    timestamp: new Date().toISOString(),
  });
}
