import { NextResponse } from "next/server";
import dns from "dns/promises";

const WORDLIST = [
  "www",
  "mail",
  "api",
  "admin",
  "cpanel",
  "webmail",
  "blog",
  "dev",
  "test",
  "staging",
];

export async function POST(req: Request) {
  try {
    let { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Target kosong" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const hostname = new URL(url).hostname;

    // === IP RESOLVE ===
    let ip = "Unresolved";
    try {
      const res = await dns.lookup(hostname);
      ip = res.address;
    } catch {}

    // === MAIN FETCH ===
    const res = await fetch(url, { method: "GET" });

    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => (headers[k] = v));

    // === TECH DETECTION (HEADER BASED) ===
    const tech: string[] = [];

    if (headers["server"]) tech.push(`Server: ${headers["server"]}`);
    if (headers["x-powered-by"]) tech.push(`Powered: ${headers["x-powered-by"]}`);
    if (headers["cf-ray"]) tech.push("Cloudflare");
    if (headers["x-vercel-id"]) tech.push("Vercel");
    if (headers["x-nextjs-cache"]) tech.push("Next.js");

    // === SUBDOMAIN SCAN ===
    const subdomains: string[] = [];

    await Promise.all(
      WORDLIST.map(async (sub) => {
        const full = `${sub}.${hostname}`;
        try {
          await dns.lookup(full);
          subdomains.push(full);
        } catch {}
      })
    );

    return NextResponse.json({
      target: hostname,
      ip,
      status: res.status,
      tech,
      headers,
      subdomains,
    });
  } catch (err: any) {
    console.error("SCAN ERROR:", err);
    return NextResponse.json(
      { error: "Internal scan error", detail: String(err) },
      { status: 500 }
    );
  }
}
