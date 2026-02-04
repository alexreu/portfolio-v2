import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle maintenance mode.
 *
 * To enable maintenance mode, set MAINTENANCE_MODE=true in your environment variables.
 * The /maintenance page and /api routes will still be accessible.
 */
export function middleware(request: NextRequest) {
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

    if (!isMaintenanceMode) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Allow access to maintenance page, API routes, static files, and studio
    const allowedPaths = [
        "/maintenance",
        "/api",
        "/_next",
        "/favicon",
        "/studio",
    ];

    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    if (isAllowed) {
        return NextResponse.next();
    }

    // Redirect to maintenance page
    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.redirect(maintenanceUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*|studio).*)",
    ],
};
