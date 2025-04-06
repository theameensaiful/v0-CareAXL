import { NextResponse } from "next/server"

export async function GET() {
  // Use a non-public environment variable
  return NextResponse.json({
    apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  })
}

