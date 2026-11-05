import fs from 'fs';
const src = fs.readFileSync('/home/user/webapp/public/static/app.js','utf8');
function grab(name){ const i=src.indexOf('const '+name+' = '); let j=src.indexOf('{',i), d=0, k=j; for(;k<src.length;k++){ if(src[k]=='{')d++; if(src[k]=='}'){d--; if(!d)break;} } return eval('('+src.slice(j,k+1)+')'); }
const NET=grab('NET_REGISTRY'), TOK=grab('TOKEN_ADDRS'), MID=grab('MID_TOKENS_BY_CHAIN');
const good=JSON.parse(fs.readFileSync('good2.json'));
const call=async(cid,method,params)=>{ for(const u of good[cid]){ try{ const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(9000)}); const j=await r.json(); if(j.result!==undefined||j.error)return j; }catch{} } return {error:{message:'all rpc failed'}}; };
const code=async(cid,a)=>{const r=await call(cid,'eth_getCode',[a,'latest']);return r.result&&r.result.length>4};
console.log('=== candidate fixes ===');
console.log('Sepolia V3 router +E', await code('11155111','0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E'));
console.log('Sepolia QuoterV2 (app)', await code('11155111',NET['11155111'].uniV3Quoter));
console.log('Sepolia QuoterV2 0xEd1f6473345F45b75833fd55D191EBE6d39fC450 is app value; alt official 0xEd1f6473345F45b75833fd55D191EBE6d39fC450');
// ABI helpers
const pad=h=>h.replace(/^0x/,'').toLowerCase().padStart(64,'0');
const amtOut=(amt,path)=>'0xd06ca61f'+pad(amt.toString(16))+pad('40')+pad(path.length.toString(16))+path.map(pad).join('');
const dec=h=>{const x=h.slice(2);const n=parseInt(x.slice(64+0,64+64),16);/*offset*/ const len=parseInt(x.slice(64,128),16); const arr=[]; for(let i=0;i<len;i++)arr.push(BigInt('0x'+x.slice(128+i*64,192+i*64))); return arr;};
const decimals={USDC:6,USDCe:6,USDT:6,WBTC:8,DAI:18,WETH:18,WMATIC:18,WBNB:18};
console.log('\n=== LIVE getAmountsOut: base -> mid on each V2 router (mainnets) ===');
const results={};
for(const cid of ['1','137','42161','10','8453','56']){
  const n=NET[cid], t=TOK[cid]; if(!t) {console.log(cid,'no TOKEN_ADDRS');continue;}
  const bases=Object.keys(t).filter(s=>/^W(ETH|MATIC|BNB)$/.test(s)); const mids=(MID[cid]||[]).filter(m=>t[m]);
  for(const b of bases.slice(0,1)) for(const m of mids.slice(0,3)){
    const one=10n**BigInt(decimals[b]||18);
    const row=[];
    for(const [name,router] of [['uni',n.uniRouter],['sushi',n.sushiRouter]]){
      const r=await call(cid,'eth_call',[{to:router,data:amtOut(one,[t[b],t[m]])},'latest']);
      if(r.result&&r.result!=='0x'){ try{const a=dec(r.result); row.push(name+'='+(Number(a[1])/10**(decimals[m]||18)).toFixed(4));}catch{row.push(name+'=decodeErr')} } else row.push(name+'=FAIL('+(r.error?.message||'empty').slice(0,25)+')');
    }
    console.log(cid.padEnd(6),(b+'->'+m).padEnd(14),row.join('  '));
  }
}
