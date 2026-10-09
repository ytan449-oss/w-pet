import { createServer } from "node:http";
import { handleCheckout, type CheckoutEnv } from "../src/server/checkout";
import { handleContact, type ContactEnv } from "../src/server/contact";
import { openLocalDatabase } from "../db/local";

const env: CheckoutEnv & ContactEnv = { ...process.env, DB: openLocalDatabase() };
createServer(async (incoming,outgoing)=>{
  try {
    const chunks: Buffer[]=[];
    let size=0;
    for await(const chunk of incoming) { size+=chunk.length; if(size>16000) {outgoing.writeHead(413);outgoing.end();return;} chunks.push(chunk); }
    const headers=new Headers();
    for(const [key,value] of Object.entries(incoming.headers)) if(value) headers.set(key,Array.isArray(value)?value.join(","):value);
    const request=new Request(`http://127.0.0.1:8787${incoming.url}`,{method:incoming.method,headers,...(incoming.method!=="GET" && incoming.method!=="HEAD" ? {body:Buffer.concat(chunks)} : {})});
    const response=await (new URL(request.url).pathname.startsWith("/api/contact") ? handleContact(request,env) : handleCheckout(request,env));
    outgoing.writeHead(response.status,Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500); outgoing.end("API unavailable"); }
}).listen(8787,"127.0.0.1",()=>console.log("Contact and test payment API listening on 127.0.0.1:8787"));
