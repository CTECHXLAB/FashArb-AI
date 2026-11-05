import fs from 'fs';
const good=JSON.parse(fs.readFileSync('good2.json'));
const call=async(cid,method,params)=>{ for(const u of good[cid]){ try{ const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(9000)}); const j=await r.json(); if(j.result!==undefined||(j.error&&!/rate|limit/i.test(j.error.message||'')))return j; }catch{} } return {error:{message:'all rpc failed'}}; };
const pad=h=>h.replace(/^0x/,'').toLowerCase().padStart(64,'0');
const T={ '1':{w:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',u:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'},
 '137':{w:'0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',u:'0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'},
 '42161':{w:'0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',u:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831'},
 '10':{w:'0x4200000000000000000000000000000000000006',u:'0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'},
 '8453':{w:'0x4200000000000000000000000000000000000006',u:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'},
 '56':{w:'0x2170Ed0880ac9A755fd29B2688956BD959F933F8',u:'0x55d398326f99059fF775485246999027B3197955'} };
const cands={ '1':['0x61fFE014bA17989E743c5F6cB21bF9697530B21e'],
 '137':['0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6','0x61fFE014bA17989E743c5F6cB21bF9697530B21e'],
 '42161':['0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6','0x61fFE014bA17989E743c5F6cB21bF9697530B21e'],
 '10':['0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6','0x61fFE014bA17989E743c5F6cB21bF9697530B21e'],
 '8453':['0x222ca98f00ed15b1fae10b61c277703a194cf5d2'],
 '56':['0x78D78E420Da98ad378D7799bE8f4AF69033EB077'] };
for(const [cid,list] of Object.entries(cands)) for(const q of list){
  const code=await call(cid,'eth_getCode',[q,'latest']); const has=code.result&&code.result.length>4;
  let res='-';
  if(has){ for(const fee of [500,3000,100,2500]){
    const data='0xc6a5026a'+pad(T[cid].w)+pad(T[cid].u)+pad((10n**18n).toString(16))+pad(fee.toString(16))+pad('0');
    const r=await call(cid,'eth_call',[{to:q,data},'latest']);
    if(r.result&&r.result!=='0x'){res='V2-selector OK fee='+fee+' out='+(Number(BigInt('0x'+r.result.slice(2,66)))/1e6).toFixed(2); break;} else res='V2-selector FAIL ('+(r.error?.message||'empty').slice(0,30)+')'; } }
  console.log(cid.padEnd(6),q,has?'code':'NOCODE',res);
}
