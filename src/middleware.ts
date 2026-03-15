export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/households/:path*",
    "/admissions/:path*",
    "/waitlist/:path*",
    "/attendance/:path*",
    "/gradebook/:path*",
    "/schedule/:path*",
    "/calendar/:path*",
    "/invoices/:path*",
    "/payments/:path*",
    "/tuition-plans/:path*",
    "/messages/:path*",
    "/announcements/:path*",
    "/interventions/:path*",
    "/forms/:path*",
    "/documents/:path*",
    "/tefa/:path*",
    "/analytics/:path*",
    "/staff/:path*",
    "/settings/:path*",
    "/portal/:path*",
  ],
};
