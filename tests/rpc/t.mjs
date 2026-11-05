import fs from 'fs';
const src = fs.readFileSync('/home/user/webapp/public/static/app.js','utf8');
// extract PUBLIC_RPCS and NET_REGISTRY by evaluating the object literals
function grab(name){ const i=src.indexOf('const '+name+' = '); let j=src.indexOf('{',i), d=0, k=j; for(;k<src.length;k++){ if(src[k]=='{')d++; if(src[k]=='}'){d--; if(!d)break;} } return eval('('+src.slice(j,k+1)+')'); }
const RPCS=grab('PUBLIC_RPCS'), NET=grab('NET_REGISTRY'), TOK=grab('TOKEN_ADDRS');
const call=async(rpc,method,params)=>{ try{ const r=await fetch(rpc,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(9000)}); const t=await r.text(); try{return JSON.parse(t)}catch{return {error:{message:t.slice(0,60)}}} }catch(e){return {error:{message:String(e.message||e).slice(0,50)}}} };
console.log('=== RPC health (eth_chainId matches?) ===');
const good={};
for(const [cid,list] of Object.entries(RPCS)){ good[cid]=[]; for(const rpc of list){ const r=await call(rpc,'eth_chainId',[]); const ok=r.result&&parseInt(r.result,16)==cid; console.log((ok?'OK  ':'FAIL')+' '+cid.padEnd(9)+rpc+(ok?'':'  -> '+(r.error?.message||JSON.stringify(r)).slice(0,60))); if(ok)good[cid].push(rpc);} }
console.log('\n=== contract code at router/quoter addresses ===');
for(const [cid,n] of Object.entries(NET)){ const rpc=good[cid]?.[0]; if(!rpc){console.log(cid,n.name,'NO WORKING RPC');continue;}
  for(const k of ['aaveProvider','uniRouter','sushiRouter','uniV3Router','uniV3Quoter']){ const r=await call(rpc,'eth_getCode',[n[k],'latest']); const has=r.result&&r.result.length>4; console.log((has?'OK  ':'NONE')+' '+cid.padEnd(9)+k.padEnd(14)+n[k]); } }
console.log('\n=== token code (mainnets) ===');
for(const [cid,toks] of Object.entries(TOK)){ const rpc=good[cid]?.[0]; if(!rpc)continue; for(const [s,a] of Object.entries(toks)){ const r=await call(rpc,'eth_getCode',[a,'latest']); if(!(r.result&&r.result.length>4)) console.log('NO CODE',cid,s,a);} }
console.log('token check done');
fs.writeFileSync('good.json',JSON.stringify(good));
