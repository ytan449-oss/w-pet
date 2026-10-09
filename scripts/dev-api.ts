import { createServer } from "node:http";
import { handleCheckout, type CheckoutEnv } from "../src/server/checkout";

const env=process.env as CheckoutEnv;
createServer(async (incoming,outgoing)=>{
  try {
    const chunks: Buffer[]=[];
    let size=0;
    for await(const chunk of incoming) { size+=chunk.length; if(size>16000) {outgoing.writeHead(413);outgoing.end();return;} chunks.push(chunk); }
    const headers=new Headers();
    for(const [key,value] of Object.entries(incoming.headers)) if(value) headers.set(key,Array.isArray(value)?value.join(","):value);
    const request=new Request(`http://127.0.0.1:8787${incoming.url}`,{method:incoming.method,headers,...(incoming.method!=="GET" && incoming.method!=="HEAD" ? {body:Buffer.concat(chunks)} : {})});
    const response=await handleCheckout(request,env);
    outgoing.writeHead(response.status,Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500); outgoing.end("API unavailable"); }
}).listen(8787,"127.0.0.1",()=>console.log("Test payment API listening on 127.0.0.1:8787"));
