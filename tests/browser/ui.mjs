import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errors=[], failed=[], logs=[];
page.on('pageerror', e=>errors.push(String(e.message).slice(0,200)));
page.on('console', m=>{ if(m.type()==='error') errors.push('console.error: '+m.text().slice(0,200)); });
page.on('requestfailed', r=>failed.push(r.url().slice(0,90)+' '+(r.failure()?.errorText||'')));
await page.goto('http://localhost:3000/static/index.html',{waitUntil:'load',timeout:45000});
await page.waitForTimeout(3000);
console.log('title:', await page.title());
console.log('api modal visible after 1.5s (no keys):', await page.evaluate(()=>getComputedStyle(document.getElementById('api-modal')).display));
console.log('chaingpt input present:', await page.evaluate(()=>!!document.getElementById('chaingpt-key-input')));
// close modal like a user
await page.evaluate(()=>closeApiModal());
// tabs
for(let i=0;i<6;i++){ await page.evaluate(n=>switchTab(n),i); }
console.log('switchTab 0-5: ok');
// key functions defined?
const fns=['scanOnChainOpps','freshLegQuote','freshV2Quote','freshV3Quote','pickMidToken','resolveDexOrNull','executeRealFlashLoan','fetchChainGptQuote','rpcEthCall'];
console.log('functions:', JSON.stringify(await page.evaluate(f=>Object.fromEntries(f.map(n=>[n,typeof window[n]])),fns)));
// live scan on each mainnet using app's own code, NO wallet
console.log('\n=== scanOnChainOpps (live RPC, in browser, no wallet) ===');
for(const cid of ['1','137','42161','10','8453','56']){
  const r = await page.evaluate(async c=>{ const t=Date.now(); try{ const o=await scanOnChainOpps(c); return {ms:Date.now()-t,n:o.length,top:o.slice(0,3).map(x=>`${x.tokenPair} ${x.buyDex}->${x.sellDex} ${x.profitPercent}% mid=${x.midToken}`)}; }catch(e){return {err:String(e.message||e)}} }, cid);
  console.log(cid.padEnd(6), JSON.stringify(r));
}
// fresh quote path, real RPC
console.log('\n=== freshLegQuote (live) ===');
const q = await page.evaluate(async()=>{
  const out={};
  for(const [cid,base,mid] of [['1','WETH','USDC'],['137','WETH','USDCe'],['42161','WETH','USDC'],['8453','WETH','USDC'],['11155111','WETH','USDC']]){
    const net=NET_REGISTRY[cid], t=TOKEN_ADDRS[cid];
    try{
      const a=await freshLegQuote(cid, DEX_UNI_V2, t[base], t[mid], 10n**18n, 3000, net);
      const b=await freshLegQuote(cid, DEX_SUSHI,  t[base], t[mid], 10n**18n, 3000, net);
      const c=await freshLegQuote(cid, DEX_UNI_V3, t[base], t[mid], 10n**18n, 3000, net);
      out[cid]={uniV2:a?.toString()||null, sushi:b?.toString()||null, uniV3:c?.toString()||null};
    }catch(e){ out[cid]={err:String(e.message||e)} }
  }
  return out;
});
console.log(JSON.stringify(q,null,1));
console.log('\n=== page errors ===', errors.length? errors : 'none');
console.log('=== failed requests (first 12) ===', failed.slice(0,12));
await browser.close();
