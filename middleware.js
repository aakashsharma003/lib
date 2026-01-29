import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes - only "/" and auth pages
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Explicitly check if this is a protected route (anything that's not public)
  const isProtectedRoute = !isPublicRoute(req);

  // If user is NOT logged in and trying to access protected route
  if (!userId && isProtectedRoute) {
    // Redirect to landing page
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // If user IS logged in and trying to access landing page
  if (userId && pathname === "/") {
    // Redirect to home page
    const url = new URL("/home", req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
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

