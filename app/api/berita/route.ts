import { withCors, handleOptions } from "@/app/lib/cors";
import { NextResponse } from "next/server";
import { getBerita } from "@/app/lib/berita";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  try {
    const data = await getBerita(page, limit);
    return withCors(NextResponse.json(data), request);
  } catch (error: any) {
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }), request);
  }
}
export const OPTIONS = handleOptions;
