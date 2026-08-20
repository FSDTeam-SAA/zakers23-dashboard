import Link from "next/link";

export default function NotFound() {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div style={{ textAlign: "center" }}><p className="eyebrow">Error 404</p><h1>Page not found</h1><p style={{ color: "#64748b" }}>The page you are looking for does not exist.</p><Link href="/" className="primary-button" style={{ display: "inline-flex", marginTop: 16 }}>Back to dashboard</Link></div></main>;
}
