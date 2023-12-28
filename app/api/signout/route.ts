import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request | NextRequest) {
  try {
    const auth = cookies().get("userToken") || "";
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    cookies().delete("userToken");
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
