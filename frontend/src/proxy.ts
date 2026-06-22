import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect only the app surface that requires a signed-in user. Everything else
// (landing page, course catalog, marketing pages, auth pages) is public so
// anonymous visitors can browse — this is a public-facing marketing site.
const isProtectedRoute = createRouteMatcher(["/user(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
