import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server (.next/standalone/server.js) for the Docker image.
  output: "standalone",
  // Production serves the inbox under the admin's host (e.g.
  // app.whatidea.io/inbox) so the browser sends the WhatIdea session cookie.
  // Needed at build AND start time (next.config is re-evaluated on start);
  // empty in local dev (http://localhost:4000/?instance=).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
