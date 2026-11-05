import fs from 'fs';
const src = fs.readFileSync('/home/user/webapp/public/static/app.js','utf8');
function grab(name){ const i=src.indexOf('const '+name+' = '); let j=src.indexOf('{',i), d=0, k=j; for(;k<src.length;k++){ if(src[k]=='{')d++; if(src[k]=='}'){d--; if(!d)break;} } return eval('('+src.slice(j,k+1)+')'); }
const NET=grab('NET_REGISTRY'), TOK=grab('TOKEN_ADDRS');
// 1. address format check
console.log('=== address format (must be 0x + 40 hex) ===');
let bad=0;
for(const [cid,n] of Object.entries(NET)) for(const [k,v] of Object.entries(n)) if(typeof v==='string'&&v.startsWith('0x')&&!/^0x[0-9a-fA-F]{40}$/.test(v)){bad++;console.log('BAD NET',cid,k,v,'len',v.length-2);}
for(const [cid,t] of Object.entries(TOK)) for(const [s,v] of Object.entries(t)) if(!/^0x[0-9a-fA-F]{40}$/.test(v)){bad++;console.log('BAD TOKEN',cid,s,v,'len',v.length-2);}
console.log('bad addresses:',bad);
const call=async(rpc,method,params)=>{ try{ const r=await fetch(rpc,{method:'POST',headers:{'content-type':'application/json',origin:'https://example.com'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(9000)}); const cors=r.headers.get('access-control-allow-origin'); const t=await r.text(); let j; try{j=JSON.parse(t)}catch{j={error:{message:t.slice(0,50)}}} j.cors=cors; return j; }catch(e){return {error:{message:String(e.message||e).slice(0,40)}}} };
// 2. candidate RPCs: health + CORS header
const cand={
 '1':['https://ethereum-rpc.publicnode.com','https://eth.drpc.org','https://1rpc.io/eth','https://cloudflare-eth.com','https://eth.merkle.io','https://rpc.mevblocker.io','https://rpc.flashbots.net'],
 '137':['https://polygon-bor-rpc.publicnode.com','https://polygon.drpc.org','https://1rpc.io/matic','https://polygon.meowrpc.com','https://polygon.rpc.blxrbdn.com'],
 '42161':['https://arb1.arbitrum.io/rpc','https://arbitrum-one-rpc.publicnode.com','https://arbitrum.drpc.org','https://1rpc.io/arb','https://arb-protect.flashbots.net'],
 '10':['https://mainnet.optimism.io','https://optimism-rpc.publicnode.com','https://optimism.drpc.org','https://1rpc.io/op'],
 '8453':['https://mainnet.base.org','https://base-rpc.publicnode.com','https://base.drpc.org','https://1rpc.io/base'],
 '56':['https://bsc-dataseed1.binance.org','https://bsc-rpc.publicnode.com','https://bsc.drpc.org','https://1rpc.io/bnb','https://bsc.rpc.blxrbdn.com'],
 '11155111':['https://ethereum-sepolia-rpc.publicnode.com','https://sepolia.drpc.org','https://1rpc.io/sepolia'],
 '80002':['https://polygon-amoy-bor-rpc.publicnode.com','https://polygon-amoy.drpc.org'],
 '84532':['https://sepolia.base.org','https://base-sepolia-rpc.publicnode.com'],
 '421614':['https://sepolia-rollup.arbitrum.io/rpc','https://arbitrum-sepolia-rpc.publicnode.com'],
};
console.log('\n=== candidate RPCs: chainId match + CORS header ===');
const good={};
for(const [cid,l] of Object.entries(cand)){ good[cid]=[]; for(const u of l){ const r=await call(u,'eth_chainId',[]); const ok=r.result&&parseInt(r.result,16)==cid; console.log((ok?'OK  ':'FAIL')+' '+cid.padEnd(9)+u.padEnd(52)+'CORS='+(r.cors||'none')+(ok?'':'  '+(r.error?.message||'').slice(0,40))); if(ok&&r.cors)good[cid].push(u);} }
fs.writeFileSync('good2.json',JSON.stringify(good,null,1));
// 3. address re-checks
const g=(cid)=>good[cid][0];
console.log('\n=== re-check suspect addresses ===');
const code=async(cid,a)=>{const r=await call(g(cid),'eth_getCode',[a,'latest']);return r.result&&r.result.length>4?'HAS CODE':'NO CODE ('+(r.error?.message||'')+')'};
console.log('ETH Aave provider as in app   ',NET['1'].aaveProvider, await code('1',NET['1'].aaveProvider));
console.log('ETH Aave provider + "e"       ','0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e', await code('1','0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e'));
for(const a of ['0x3d4e44Eb1374240CE5F1B136588eDad14f9253A5','0x222ca98f00ed15b1fae10b61c277703a194cf5d2']) console.log('Base quoter candidate        ',a, await code('8453',a));
