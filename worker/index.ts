import { assets } from "wpet:assets";
import { handleCheckout, type CheckoutEnv } from "../src/server/checkout";
import { handleContact, type ContactEnv } from "../src/server/contact";

export default {
  async fetch(request: Request, env: CheckoutEnv & ContactEnv): Promise<Response> {
    const url=new URL(request.url);
    if(url.pathname === "/api/contact" || url.pathname.startsWith("/api/contact/")) return handleContact(request,env);
    if(url.pathname.startsWith("/api/")) return handleCheckout(request,env);
    if(request.method!=="GET" && request.method!=="HEAD") return new Response("Method not allowed",{status:405,headers:{allow:"GET, HEAD"}});
    let path: string;
    try { path=decodeURIComponent(url.pathname); } catch { return new Response("Not found",{status:404}); }
    const directory=path.endsWith("/") ? path : `${path}/`;
    const flight=request.headers.get("rsc")==="1" ? assets[`${directory}index.txt`] : undefined;
    let entry=flight ?? assets[path] ?? assets[`${directory}index.html`];
    let status=200;
    if(!entry) { entry=assets["/404.html"] ?? assets["/_not-found/index.html"]; status=404; }
    if(!entry) return new Response("Not found",{status:404});
    const bytes=request.method==="HEAD" ? null : Uint8Array.from(atob(entry[0]),char=>char.charCodeAt(0));
    return new Response(bytes,{status,headers:{"content-type":entry[1],"x-content-type-options":"nosniff","cache-control":path.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-store"}});
  },
};
