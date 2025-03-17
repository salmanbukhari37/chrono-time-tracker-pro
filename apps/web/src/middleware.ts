import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/tasks",
  "/timer",
  // Add more protected routes as needed
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware running for path:", pathname);

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  console.log("Route status:", { isProtectedRoute, isAuthRoute });

  // We're not checking authentication in middleware anymore
  // Authentication is handled on the client side using localStorage
  // This middleware only handles routing logic

  // Continue with the request
  console.log("Continuing with request");
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all protected routes and auth routes explicitly
     */
    "/dashboard/:path*",
    "/tasks/:path*",
    "/timer/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};
