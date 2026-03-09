import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/landing(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isLandingRoute = createRouteMatcher(["/", "/landing(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // protect private routes
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // redirect logged-in users away from landing
  if (userId && isLandingRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
