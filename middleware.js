import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes — accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Routes that should redirect logged-in users to /home
const isLandingRoute = createRouteMatcher(["/", "/landing(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // If user is NOT logged in and trying to access a protected route → landing
  if (!userId && !isPublicRoute(req)) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // If user IS logged in and on any landing/root page → redirect to /home
  if (userId && isLandingRoute(req)) {
    const url = new URL("/home", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

