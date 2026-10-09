import Link from "next/link";

export default function GlobalNotFound() {
  return <html lang="en"><body style={{ background: "#fbf8f1", color: "#263c2b", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "20vh 24px" }}><h1>A little off the beaten path.</h1><p>We could not find that page.</p><Link href="/en/">Back to W Pet</Link></body></html>;
}
