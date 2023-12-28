import { NextResponse } from "next/server";

export const middleware = (request: any) => {
  const publicUrl = request.nextUrl.pathname === "/";
  const token = request.cookies.get("userToken") || null;

  if (!publicUrl && !token) {
    // console.log("Not public url and not token");
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    // console.log("public url and token");
  }

  // console.log("Hello Middleware");
  // console.log("Hello Middleware", request.url);
};

export const config = {
  matcher: ["/", "/api/:path*", "/dashboard/:path*"],
};
