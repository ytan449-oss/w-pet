import { build } from "esbuild";
import { readdir, readFile, mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".webp":"image/webp",".png":"image/png",".ico":"image/x-icon",".woff2":"font/woff2",".txt":"text/x-component; charset=utf-8"};
const assets={};
async function collect(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()) { await collect(file); continue; }
    const key="/"+path.relative("out",file).split(path.sep).join("/");
    const type=key==="/robots.txt" ? "text/plain; charset=utf-8" : types[path.extname(file)] ?? "application/octet-stream";
    assets[key]=[(await readFile(file)).toString("base64"),type];
  }
}
await collect("out");
if(!assets["/en/checkout/index.html"] || !assets["/en/products/aotearoa-bloom-hand-woven-dog-leash/index.html"]) throw new Error("Required Next.js exports are missing");
await mkdir("dist/server",{recursive:true});
await mkdir("dist/.openai",{recursive:true});
await build({entryPoints:["worker/index.ts"],outfile:"dist/server/index.js",bundle:true,minify:true,format:"esm",platform:"browser",target:"es2022",plugins:[{name:"next-export-assets",setup(builder){
  builder.onResolve({filter:/^wpet:assets$/},()=>({path:"assets",namespace:"wpet"}));
  builder.onLoad({filter:/.*/,namespace:"wpet"},()=>({contents:`export const assets=${JSON.stringify(assets)};`,loader:"js"}));
}}]});
await copyFile(".openai/hosting.json","dist/.openai/hosting.json");
const output=await stat("dist/server/index.js");
console.log(`Packaged ${Object.keys(assets).length} Next.js export assets and payment API into Worker (${output.size} bytes).`);
